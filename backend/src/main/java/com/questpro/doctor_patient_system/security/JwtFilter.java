package com.questpro.doctor_patient_system.security;

import com.questpro.doctor_patient_system.repository.IBlacklistedTokenRepository;
import com.questpro.doctor_patient_system.service.CustomUserDetailService;
import com.questpro.doctor_patient_system.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Autowired
    private IBlacklistedTokenRepository blacklistedTokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String jwtToken= request.getHeader("Authorization");

        if (request.getMethod().equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }
            // if the token is empty or blank reject the request
        if(jwtToken== null ||!jwtToken.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return ;
        }

        // Remove "Bearer " prefix from token
        String token= jwtToken.substring(7);
        String email = jwtService.extractUserEmailFromToken(token);

        //  Check if token is blacklisted
        if (blacklistedTokenRepository.existsByToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Token has been invalidated. Please login again.\",\"data\":null}"
            );
            return;
        }

            // check if user is already authenticated
        if(email!= null && SecurityContextHolder.getContext().getAuthentication() ==null){
            UserDetails userDetails= customUserDetailService.loadUserByUsername(email);

            if(jwtService.isTokenValid(token , userDetails)){
                String role= jwtService.extractRole(token);
                boolean mustChangePassword= jwtService.extractMustChangePassword(token);

                // If the doctor's mustchangepassword is true (has not changed password)
                // and is trying to access any other doctor endpoint other than "/doctor/change-password"
                //  return a 403 forbidden response and return a json with the below message
                if(mustChangePassword && !request.getRequestURI().equals("/doctor/change-password")){
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write(
                            "{\"success\":false,\"message\":\"Please update your password before proceeding\",\"data\":null}"
                    );
                    return ;
                }

                System.out.println("ROLE_"+role);


                List<SimpleGrantedAuthority> authorityList= List.of(new SimpleGrantedAuthority("ROLE_"+role));


                UsernamePasswordAuthenticationToken authenticationToken=
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                authorityList
                        );

                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request,response);




    }
}
