package org.iaeste.szakal2.services;


import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.exceptions.UserNotFoundException;
import org.iaeste.szakal2.exceptions.UsernameTakenException;
import org.iaeste.szakal2.models.dto.user.UserPasswordChangingDTO;
import org.iaeste.szakal2.models.dto.user.UserRoleModificationDTO;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.security.providers.UsernamePasswordProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@Log4j2
public class UserService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final UsernamePasswordProvider usernamePasswordProvider;

    public UserService(UsersRepository usersRepository,
                       PasswordEncoder passwordEncoder,
                       RoleService roleService,
                       JwtConfiguration jwtConfiguration) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
        this.usernamePasswordProvider = new UsernamePasswordProvider(usersRepository, passwordEncoder, jwtConfiguration);
    }

    public UserDTO getUserDTOById(UUID id) {
        Optional<User> userOptional = usersRepository.findUserById(id);
        if(userOptional.isEmpty()){
            throw new UserNotFoundException("User with id " + id + " not found");
        }
        return UserDTO.fromUser(userOptional.get());
    }

    public User getUserById(UUID id) {
        Optional<User> userOptional = usersRepository.findUserById(id);
        if(userOptional.isEmpty()){
            throw new UserNotFoundException(STR."""
                    User with id \{id} not found""");
        }
        return userOptional.get();
    }

    public User getUserByEmail(String email) {
        Optional<User> userOptional = usersRepository.findUserByEmailIgnoreCase(email);
        if(userOptional.isEmpty()){
            throw new UserNotFoundException("User with email " + email + " not found");
        }
        return userOptional.get();
    }

    public User getUserByUsername(String username) {
        Optional<User> userOptional = usersRepository.findUserByUsernameIgnoreCase(username);
        if(userOptional.isEmpty()){
            throw new UserNotFoundException("User with username " + username + " not found");
        }
        return userOptional.get();
    }

    public UserDTO registerUser(UserCreationDTO userCreationDTO) {
        if (usersRepository.findUserByEmailIgnoreCase(userCreationDTO.getEmail()).isPresent()) {
            throw new UsernameTakenException("Email already taken");
        }
        if (usersRepository.findUserByUsernameIgnoreCase(userCreationDTO.getUsername()).isPresent()) {
            throw new UsernameTakenException("Username already taken");
        }
        User user = User.fromCreationDTO(userCreationDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return UserDTO.fromUser(usersRepository.save(user));
    }

    public UserDTO modifyUserRoles(UUID userId, UserRoleModificationDTO userRoleModificationDTO){
        User user = getUserById(userId);
        user.getRoles().clear();
        user.getRoles().addAll(roleService.getRolesByIds(userRoleModificationDTO.getRoles()));
        return UserDTO.fromUser(usersRepository.save(user));
    }

    public UserDTO acceptUser(UUID userId) {
        User user = getUserById(userId);
        user.setAccepted(true);
        return UserDTO.fromUser(usersRepository.save(user));
    }

    public UserDTO changePassword(UUID userId, UserPasswordChangingDTO userPasswordChangingDTO) {
        usernamePasswordProvider.authenticate(new UsernamePasswordAuthenticationToken(
                getUserById(userId).getEmail(),
                userPasswordChangingDTO.getCurrentPassword()
        ));

        User user = getUserById(userId);
        user.setPassword(passwordEncoder.encode(userPasswordChangingDTO.getPassword()));
        return UserDTO.fromUser(usersRepository.save(user));
    }

    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return usersRepository.findAll(pageable).map(UserDTO::fromUser);
    }

    public void truncate() {
        usersRepository.deleteAll();
    }

}
