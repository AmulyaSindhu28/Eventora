package com.project.EventManagementPortal.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.EventManagementPortal.dto.UserRequest;
import com.project.EventManagementPortal.dto.UserResponse;
import com.project.EventManagementPortal.entity.User;
import com.project.EventManagementPortal.exception.DuplicateUserException;
import com.project.EventManagementPortal.exception.UserHasRegistrationsException;
import com.project.EventManagementPortal.exception.UserNotFoundException;
import com.project.EventManagementPortal.repo.EventRepo;
import com.project.EventManagementPortal.repo.RegistrationRepo;
import com.project.EventManagementPortal.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepository;

    private final RegistrationRepo registrationRepository;

    private final EventRepo eventRepository;

    @Override
    public UserResponse createUser(UserRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new DuplicateUserException(
                    "User already exists with email: "
                            + request.getEmail()
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = findUser(id);

        return convertToResponse(user);
    }

    @Override
    public UserResponse updateUser(
            Long id,
            UserRequest request) {

        User user = findUser(id);

        userRepository.findByEmailAndIdNot(
                request.getEmail(),
                id
        ).ifPresent(existingUser -> {
            throw new DuplicateUserException(
                    "Another user already exists with email: "
                            + request.getEmail()
            );
        });

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        return convertToResponse(
                userRepository.save(user)
        );
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {

        User user = findUser(id);

        if (registrationRepository.existsByUserId(id)) {

            throw new UserHasRegistrationsException(
                    "Cannot delete user because registrations exist"
            );
        }

        if (eventRepository.existsByOrganizerId(id)) {

            throw new UserHasRegistrationsException(
                    "Cannot delete organizer because events exist"
            );
        }

        userRepository.delete(user);
    }

    @Override
    public UserResponse getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with email: "
                                        + email));

        return convertToResponse(user);
    }

    private User findUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + id));
    }

    private UserResponse convertToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );
    }
}