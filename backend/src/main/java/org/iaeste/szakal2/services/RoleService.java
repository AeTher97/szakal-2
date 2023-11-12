package org.iaeste.szakal2.services;

import jakarta.transaction.Transactional;
import org.iaeste.szakal2.exceptions.UserNotFoundException;
import org.iaeste.szakal2.models.AccessRight;
import org.iaeste.szakal2.models.dto.role.RoleCreationDto;
import org.iaeste.szakal2.models.dto.role.RoleUpdateDTO;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoleService {

    private final RolesRepository rolesRepository;
    private final AccessRightRepository accessRightRepository;

    public RoleService(RolesRepository rolesRepository, AccessRightRepository accessRightRepository) {
        this.rolesRepository = rolesRepository;
        this.accessRightRepository = accessRightRepository;
    }

    @Transactional
    public Role createRole(RoleCreationDto roleCreationDto) {
        return rolesRepository.save(fromRoleCreationDTO(roleCreationDto));
    }

    public Role updateRole(RoleUpdateDTO roleUpdateDTO) {
        Optional<Role> roleOptional = rolesRepository.findRoleById(roleUpdateDTO.getId());
        if (roleOptional.isEmpty()) {
            throw new UserNotFoundException("Role not found");
        }
        Role role = roleOptional.get();
        if (roleUpdateDTO.getAccessRights() != null && !roleUpdateDTO.getAccessRights().isEmpty()) {
            List<AccessRight> accessRights = getAccessRights(roleUpdateDTO);
            role.getAccessRights().clear();
            role.getAccessRights().addAll(accessRights);
        }
        BeanUtils.copyProperties(roleUpdateDTO, role, getNullPropertyNames(roleUpdateDTO));

        return rolesRepository.save(role);
    }

    public void deleteRole(UUID id){
        rolesRepository.deleteById(id);
    }

    public Optional<Role> getRoleByName(String name) {
        return rolesRepository.findRoleByName(name);
    }

    private Role fromRoleCreationDTO(RoleCreationDto roleCreationDto) {
        List<AccessRight> accessRights = roleCreationDto.getAccessRights()
                .stream().map(accessRight -> accessRightRepository.findAccessRightById(accessRight).get()).toList();
        return Role.builder()
                .name(roleCreationDto.getName())
                .description(roleCreationDto.getDescription())
                .accessRights(accessRights)
                .build();
    }

    private List<AccessRight> getAccessRights(RoleUpdateDTO roleUpdateDto) {
        return roleUpdateDto.getAccessRights()
                .stream().map(accessRight -> accessRightRepository.findAccessRightById(accessRight).get()).toList();
    }

    public static String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        java.beans.PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<String>();
        for (java.beans.PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) emptyNames.add(pd.getName());
        }
        String[] result = new String[emptyNames.size()];
        return emptyNames.toArray(result);
    }
}
