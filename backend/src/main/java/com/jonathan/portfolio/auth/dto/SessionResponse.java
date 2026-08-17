package com.jonathan.portfolio.auth.dto;
public record SessionResponse(boolean authenticated,String email,String role) { public static SessionResponse anonymous(){return new SessionResponse(false,null,null);} }
