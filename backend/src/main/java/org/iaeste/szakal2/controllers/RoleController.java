package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.role.RoleCreationDTO;
import org.iaeste.szakal2.models.dto.role.RoleUpdateDTO;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.services.RoleService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/roles")
@Log4j2
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority(@authorityBean.roleModification())")
    public Role createRole(@RequestBody @Valid RoleCreationDTO roleCreationDto) {
        return roleService.createRole(roleCreationDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority(@authorityBean.roleModification())")
    public Role updateRole(@PathVariable("id") UUID id, @RequestBody @Valid RoleUpdateDTO roleUpdateDTO) {
        return roleService.updateRole(id, roleUpdateDTO);
    }

    @GetMapping
    public List<Role> getRoles() {
        return roleService.getRoles();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(@authorityBean.roleViewing())")
    public Role getRole(@PathVariable("id") UUID id) {
        return roleService.getRoleById(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(@authorityBean.roleModification())")
    public void deleteRole(@PathVariable("id") UUID id) {
        roleService.deleteRole(id);
    }
}
