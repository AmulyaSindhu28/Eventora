package com.project.EventManagementPortal.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.EventManagementPortal.entity.Event;
import com.project.EventManagementPortal.enums.EventCategory;
import com.project.EventManagementPortal.enums.EventStatus;

public interface EventRepo
        extends JpaRepository<Event, Long> {

    List<Event> findByCategory(
            EventCategory category
    );

    List<Event> findByStatus(
            EventStatus status
    );

    List<Event> findByLocationIgnoreCase(
            String location
    );

    List<Event> findByTitleContainingIgnoreCase(
            String keyword
    );

    boolean existsByOrganizerId(
            Long organizerId
    );
}