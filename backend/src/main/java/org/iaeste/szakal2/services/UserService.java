package org.iaeste.szakal2.services;


import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.exceptions.ResetTokenExpiredException;
import org.iaeste.szakal2.exceptions.SzakalException;
import org.iaeste.szakal2.exceptions.UserNotFoundException;
import org.iaeste.szakal2.exceptions.UsernameTakenException;
import org.iaeste.szakal2.models.dto.user.*;
import org.iaeste.szakal2.models.entities.PasswordResetToken;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.PasswordTokenRepository;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.security.providers.UsernamePasswordProvider;
import org.iaeste.szakal2.utils.EmailLoader;
import org.iaeste.szakal2.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@Service
@Log4j2
public class UserService {

    private static final int EXPIRATION = 60 * 60 * 1000; //An hour

    private final EmailService emailService;
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final UsernamePasswordProvider usernamePasswordProvider;
    private final PasswordTokenRepository passwordTokenRepository;

    public UserService(EmailService emailService, UsersRepository usersRepository,
                       PasswordEncoder passwordEncoder,
                       RoleService roleService,
                       JwtConfiguration jwtConfiguration, PasswordTokenRepository passwordTokenRepository) {
        this.emailService = emailService;
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
        this.passwordTokenRepository = passwordTokenRepository;
        this.usernamePasswordProvider = new UsernamePasswordProvider(usersRepository, passwordEncoder, jwtConfiguration);
    }

    public UserDTO getUserDTOById(UUID id) {
        Optional<User> userOptional = usersRepository.findUserById(id);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("User with id " + id + " not found");
        }
        return UserDTO.fromUser(userOptional.get());
    }

    public User getUserById(UUID id) {
        Optional<User> userOptional = usersRepository.findUserById(id);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException(STR. """
                    User with id:\{ id } not found""" );
        }
        return userOptional.get();
    }

    public User getUserByEmail(String email) {
        Optional<User> userOptional = usersRepository.findUserByEmailIgnoreCase(email);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("User with email " + email + " not found");
        }
        return userOptional.get();
    }

    public UserDTO registerUser(UserCreationDTO userCreationDTO) {
        if (usersRepository.findUserByEmailIgnoreCase(userCreationDTO.getEmail()).isPresent()) {
            throw new UsernameTakenException("Email already taken");
        }

        User user = User.fromCreationDTO(userCreationDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return UserDTO.fromUser(usersRepository.save(user));
    }

    public UserDTO modifyUserRoles(UUID userId, UserRoleModificationDTO userRoleModificationDTO) {
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

    public UserDTO updateUser(UUID userId, UserUpdateDTO userUpdateDTO) {
        User user = getUserById(userId);
        Optional<User> existingUser = usersRepository.findUserByEmailIgnoreCase(userUpdateDTO.getEmail());
        if (existingUser.isPresent() && !existingUser.get().equals(user)) {
            throw new UsernameTakenException("This email address is taken");
        }
        BeanUtils.copyProperties(userUpdateDTO, user, Utils.getNullPropertyNames(userUpdateDTO));
        return UserDTO.fromUser(usersRepository.save(user));
    }

    public UserDTO updateUserStatus(UUID userId, UpdateUserStatusDTO updateUserStatusDTO) {
        User user = getUserById(userId);
        user.setActive(updateUserStatusDTO.isActive());
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

    @Transactional
    public void sendResetCode(StartPasswordResetDTO startPasswordResetDTO) throws UserNotFoundException {
        try {
            User user = getUserByEmail(startPasswordResetDTO.getEmail());
            String token = UUID.randomUUID().toString();
            createPasswordResetToken(user, token);

            try {
                emailService.sendHtmlMessage(startPasswordResetDTO.getEmail(), "Resetowanie hasła Szakal",
                        EmailLoader.loadResetPasswordEmail().replace("${userName}",
                                        user.getName()).replace("${resetCode}", token)
                                .replace("${domainName}", System.getenv("HEROKU_APP_DEFAULT_DOMAIN_NAME")));
            } catch (Exception e) {
                throw new RuntimeException("Incorrectly setup domain");
            }
        } catch (UserNotFoundException e) {
            //Always accept the request to not hint at who is registered.
        }
    }

    @Transactional
    public void resetPassword(PasswordResetDTO passwordResetDTO) throws UserNotFoundException, ResetTokenExpiredException {
        Optional<PasswordResetToken> passwordResetTokenOptional = passwordTokenRepository
                .findPasswordResetTokenByToken(passwordResetDTO.getCode());
        if (passwordResetTokenOptional.isEmpty()) {
            throw new UserNotFoundException("Reset token invalid");
        }
        PasswordResetToken resetToken = passwordResetTokenOptional.get();
        if (resetToken.isExpired()) {
            passwordTokenRepository.delete(resetToken);
            throw new ResetTokenExpiredException("Reset token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(passwordResetDTO.getPassword()));
        passwordTokenRepository.delete(resetToken);
        usersRepository.save(user);
    }


    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return usersRepository.findAll(pageable).map(UserDTO::fromUser);
    }

    public List<UserDTO> searchUsers(String phrase) {
        String [] parts = phrase.split(" ");
        if(parts.length == 1) {
            return usersRepository.findUsersByEmailContainingIgnoreCaseOrNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(
                    parts[0], parts[0], parts[0])
                    .stream().map(UserDTO::fromUser).toList();
        } else if(parts.length > 1){
            return usersRepository.findUsersByEmailContainingIgnoreCaseOrNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(
                    parts[0], parts[0], parts[1])
                    .stream().map(UserDTO::fromUser).toList();
        } else {
            return new ArrayList<>();
        }
    }


    private void createPasswordResetToken(User user, String token) {
        PasswordResetToken passwordResetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(new Date(System.currentTimeMillis() + EXPIRATION))
                .build();
        passwordTokenRepository.save(passwordResetToken);
    }

    public UserDTO updatePicture(PictureUploadDTO pictureUploadDTO) throws IOException {
        User user = getUserById(pictureUploadDTO.getId());
        BufferedImage inputImage = ImageIO.read(pictureUploadDTO.getFile().getInputStream());
        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageOutputStream outputStream = ImageIO.createImageOutputStream(byteArrayOutputStream);

        writer.setOutput(outputStream);

        ImageWriteParam imageWriteParam = writer.getDefaultWriteParam();
        imageWriteParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        imageWriteParam.setCompressionQuality(0.2f);

        writer.write(null, new IIOImage(inputImage,null, null), imageWriteParam);

        user.setProfilePicture(byteArrayOutputStream.toByteArray());
        return UserDTO.fromUser(usersRepository.save(user));
    }

    public void deleteUserIfNotAccepted(UUID id) {
        User user = getUserById(id);
        if(user.isAccepted()){
            throw new SzakalException("Cannot delete already accepted user");
        } else {
            usersRepository.delete(user);
        }
    }
}
