
package com.project.EventManagementPortal.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.EventManagementPortal.dto.AuthResponse;
import com.project.EventManagementPortal.dto.LoginRequest;
import com.project.EventManagementPortal.dto.RegisterRequest;
import com.project.EventManagementPortal.dto.UserResponse;
import com.project.EventManagementPortal.entity.User;
import com.project.EventManagementPortal.enums.UserRole;
import com.project.EventManagementPortal.repo.UserRepo;
import com.project.EventManagementPortal.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getEmail());

        return new AuthResponse(token, toResponse(saved));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email, request.getPassword()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password"));

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token, toResponse(user));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole());
    }
}
