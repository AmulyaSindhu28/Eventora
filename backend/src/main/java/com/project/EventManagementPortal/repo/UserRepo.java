package com.project.EventManagementPortal.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.EventManagementPortal.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndIdNot(
            String email,
            Long id
    );
}