package com.jonathan.portfolio;

import java.sql.*;
import java.time.Instant;
import java.util.UUID;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public final class AdminCliApplication {
    private AdminCliApplication() {}
    public static void main(String[] args)throws Exception{
        var command=args.length==0?"help":args[0];var email=require("ADMIN_INITIAL_EMAIL").trim().toLowerCase();var url=env("DATABASE_URL","jdbc:postgresql://localhost:5432/portfolio");var user=env("POSTGRES_USER","portfolio");var password=env("POSTGRES_PASSWORD","portfolio");
        try(var connection=DriverManager.getConnection(url,user,password)){
            switch(command){
                case "create"->create(connection,email,requireStrongPassword());
                case "reset"->reset(connection,email,requireStrongPassword());
                case "disable"->updateEnabled(connection,email,false);
                case "enable"->updateEnabled(connection,email,true);
                case "delete"->delete(connection,email);
                default->throw new IllegalArgumentException("Utilisez -PadminCommand=create|reset|disable|enable|delete");
            }
        }
    }
    private static void create(Connection c,String email,String password)throws SQLException{try(var s=c.prepareStatement("INSERT INTO admin_user(id,email,password_hash,role,enabled,created_at,updated_at) VALUES(?, ?, ?, 'ADMIN', TRUE, ?, ?)")){var id=UUID.randomUUID();var now=Timestamp.from(Instant.now());s.setObject(1,id);s.setString(2,email);s.setString(3,new BCryptPasswordEncoder(12).encode(password));s.setTimestamp(4,now);s.setTimestamp(5,now);s.executeUpdate();audit(c,"ADMIN_CREATE",id,"{\"via\":\"cli\"}");System.out.println("Administrateur créé : "+email);}}
    private static void reset(Connection c,String email,String password)throws SQLException{var id=findId(c,email);try(var s=c.prepareStatement("UPDATE admin_user SET password_hash=?,updated_at=now() WHERE id=?")){s.setString(1,new BCryptPasswordEncoder(12).encode(password));s.setObject(2,id);s.executeUpdate();}deleteSessions(c,email);audit(c,"ADMIN_PASSWORD_RESET",id,"{\"via\":\"cli\"}");System.out.println("Mot de passe réinitialisé et sessions invalidées.");}
    private static void updateEnabled(Connection c,String email,boolean enabled)throws SQLException{var id=findId(c,email);try(var s=c.prepareStatement("UPDATE admin_user SET enabled=?,updated_at=now() WHERE id=?")){s.setBoolean(1,enabled);s.setObject(2,id);s.executeUpdate();}if(!enabled)deleteSessions(c,email);audit(c,enabled?"ADMIN_ENABLE":"ADMIN_DISABLE",id,"{\"via\":\"cli\"}");System.out.println(enabled?"Compte activé.":"Compte désactivé et sessions invalidées.");}
    private static void delete(Connection c,String email)throws SQLException{var id=findId(c,email);deleteSessions(c,email);audit(c,"ADMIN_DELETE",id,"{\"via\":\"cli\"}");try(var s=c.prepareStatement("DELETE FROM admin_user WHERE id=?")){s.setObject(1,id);s.executeUpdate();}System.out.println("Compte supprimé : "+email);}
    private static UUID findId(Connection c,String email)throws SQLException{try(var s=c.prepareStatement("SELECT id FROM admin_user WHERE lower(email)=lower(?)")){s.setString(1,email);try(var r=s.executeQuery()){if(!r.next())throw new IllegalArgumentException("Compte introuvable.");return r.getObject(1,UUID.class);}}}
    private static void deleteSessions(Connection c,String email)throws SQLException{try(var s=c.prepareStatement("DELETE FROM SPRING_SESSION WHERE PRINCIPAL_NAME=?")){s.setString(1,email);s.executeUpdate();}}
    private static void audit(Connection c,String action,UUID actor,String details)throws SQLException{try(var s=c.prepareStatement("INSERT INTO audit_log(id,action,actor_id,details,created_at) VALUES(?,?,?,?::jsonb,now())")){s.setObject(1,UUID.randomUUID());s.setString(2,action);s.setObject(3,actor);s.setString(4,details);s.executeUpdate();}}
    private static String requireStrongPassword(){var value=require("ADMIN_INITIAL_PASSWORD");if(value.length()<14)throw new IllegalArgumentException("ADMIN_INITIAL_PASSWORD doit contenir au moins 14 caractères.");return value;}
    private static String require(String name){var value=System.getenv(name);if(value==null||value.isBlank())throw new IllegalArgumentException(name+" est obligatoire.");return value;}
    private static String env(String name,String fallback){var value=System.getenv(name);return value==null||value.isBlank()?fallback:value;}
}
