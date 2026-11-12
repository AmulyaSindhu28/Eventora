package com.project.EventManagementPortal.service;

import java.util.List;

import com.project.EventManagementPortal.dto.UserRequest;
import com.project.EventManagementPortal.dto.UserResponse;

public interface UserService {

    UserResponse createUser(UserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UserRequest request);

    void deleteUser(Long id);

    UserResponse getUserByEmail(String email);
}