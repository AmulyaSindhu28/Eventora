package com.project.EventManagementPortal.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.EventManagementPortal.entity.Registration;
import com.project.EventManagementPortal.enums.RegistrationStatus;

public interface RegistrationRepo
        extends JpaRepository<Registration, Long> {

    List<Registration> findByEventId(
            Long eventId
    );

    List<Registration> findByUserId(
            Long userId
    );

    Optional<Registration> findByUserIdAndEventId(
            Long userId,
            Long eventId
    );

    boolean existsByEventId(
            Long eventId
    );

    boolean existsByUserId(
            Long userId
    );

    long countByEventIdAndStatus(
            Long eventId,
            RegistrationStatus status
    );
}