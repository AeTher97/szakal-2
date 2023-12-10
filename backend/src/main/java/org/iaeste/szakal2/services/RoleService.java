package org.iaeste.szakal2.services;

import jakarta.transaction.Transactional;
import org.iaeste.szakal2.exceptions.ResourceExistsException;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.entities.AccessRight;
import org.iaeste.szakal2.models.dto.role.RoleCreationDto;
import org.iaeste.szakal2.models.dto.role.RoleUpdateDTO;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.iaeste.szakal2.utils.Utils.getNullPropertyNames;

@Service
public class RoleService {

    private final RolesRepository rolesRepository;
    private final UsersRepository usersRepository;
    private final AccessRightRepository accessRightRepository;

    public RoleService(RolesRepository rolesRepository, UsersRepository usersRepository, AccessRightRepository accessRightRepository) {
        this.rolesRepository = rolesRepository;
        this.usersRepository = usersRepository;
        this.accessRightRepository = accessRightRepository;
    }

    @Transactional
    public Role createRole(RoleCreationDto roleCreationDto) {
        Optional<Role> roleOptional = rolesRepository.findRoleByNameIgnoreCase(roleCreationDto.getName());
        if (roleOptional.isPresent()) {
            throw new ResourceExistsException(STR. """
                    Role with name \{ roleCreationDto.getName() } already exists""" );
        }
        return rolesRepository.save(fromRoleCreationDTO(roleCreationDto));
    }

    public Role updateRole(UUID id, RoleUpdateDTO roleUpdateDTO) {
        Role role = getRoleById(id);
        if (roleUpdateDTO.getAccessRights() != null && !roleUpdateDTO.getAccessRights().isEmpty()) {
            List<AccessRight> accessRights = getAccessRights(roleUpdateDTO);
            role.getAccessRights().clear();
            role.getAccessRights().addAll(accessRights);
        }
        BeanUtils.copyProperties(roleUpdateDTO, role, getNullPropertyNames(roleUpdateDTO));

        return rolesRepository.save(role);
    }

    public Role getRoleById(UUID id) {
        Optional<Role> roleOptional = rolesRepository.findRoleById(id);
        if (roleOptional.isEmpty()) {
            throw new ResourceNotFoundException("Role with id" + id + " not found");
        }
        return roleOptional.get();
    }

    public List<Role> getRoles() {
        return rolesRepository.findAll();
    }

    public void deleteRole(UUID id) {
        Optional<Role> roleOptional = rolesRepository.findRoleById(id);
        if (roleOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR. """
                    Role with id \{ id } does not exist""" );
        }
        Role role = roleOptional.get();
        List<User> usersWithRole = usersRepository.findUserByRolesIn(List.of(role));
        if (!usersWithRole.isEmpty()) {
            throw new ResourceExistsException(STR. """
                    Users with role \{ role.getName() } still exist, cannot delete role""" );
        }
        rolesRepository.deleteById(id);
    }

    public void truncate() {
        rolesRepository.deleteAll();
    }

    public List<Role> getRolesByIds(List<UUID> ids) {
        return rolesRepository.findAllById(ids);
    }

    public Optional<Role> getRoleByName(String name) {
        return rolesRepository.findRoleByNameIgnoreCase(name);
    }

    private Role fromRoleCreationDTO(RoleCreationDto roleCreationDto) {
        List<AccessRight> accessRights = roleCreationDto.getAccessRights()
                .stream().map(accessRight -> {
                    if (accessRightRepository.findAccessRightById(accessRight).isPresent()) {
                        return accessRightRepository.findAccessRightById(accessRight).get();
                    } else {
                        throw new ResourceNotFoundException("Access right with id " + accessRight + " does not exist");
                    }
                }).toList();
        return Role.builder()
                .name(roleCreationDto.getName())
                .description(roleCreationDto.getDescription())
                .accessRights(accessRights)
                .build();
    }

    private List<AccessRight> getAccessRights(RoleUpdateDTO roleUpdateDto) {
        return roleUpdateDto.getAccessRights()
                .stream().map(accessRight -> {
                    if (accessRightRepository.findAccessRightById(accessRight).isPresent()) {
                        return accessRightRepository.findAccessRightById(accessRight).get();
                    } else {
                        throw new ResourceNotFoundException("Access right with id " + accessRight + " does not exist");
                    }
                }).toList();
    }

}
