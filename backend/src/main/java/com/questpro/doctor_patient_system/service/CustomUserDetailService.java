package com.questpro.doctor_patient_system.service;

import com.questpro.doctor_patient_system.entities.Users;
import com.questpro.doctor_patient_system.exceptions.UserNotFoundException;
import com.questpro.doctor_patient_system.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {
    @Autowired
    private IUserRepository userRepository;

    // This method is invoked by the authenticationManagers authenticate method
    // to get the User object from database which has the username(email), password and role.
    // it will then internally match the password and return true if user is authenticated or
    // unauthenticated
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(email).orElseThrow(()-> new UserNotFoundException("User not Found"));

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())   //hashed password
                .roles(user.getRole().name())
                .build();
    }
}
