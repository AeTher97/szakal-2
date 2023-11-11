package org.iaeste.szakal2.services;


import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.exceptions.UsernameTakenException;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.security.providers.UsernamePasswordProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@Log4j2
public class UserService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    @Setter
    private UsernamePasswordProvider usernamePasswordProvider;

    public UserService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> getUserById(UUID id) {
        return usersRepository.findUserById(id);

    }

    public Optional<User> getUserByEmail(String email) {
        return usersRepository.findUserByEmail(email);
    }

    public Optional<User> getUserByUsername(String username) {
        return usersRepository.findUserByUsername(username);
    }

    public UserDTO registerUser(UserCreationDTO userCreationDTO) {
        if (usersRepository.findUserByEmail(userCreationDTO.getEmail()).isPresent()) {
            throw new UsernameTakenException("Email already taken");
        }
        if (usersRepository.findUserByUsername(userCreationDTO.getUsername()).isPresent()) {
            throw new UsernameTakenException("Username already taken");
        }
        User user = User.fromCreationDTO(userCreationDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return UserDTO.fromUser(usersRepository.save(user));
    }

    public void truncate() {
        usersRepository.deleteAll();
    }

}
