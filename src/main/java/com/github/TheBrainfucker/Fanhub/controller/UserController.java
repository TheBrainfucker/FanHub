package com.github.TheBrainfucker.Fanhub.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.TheBrainfucker.Fanhub.exception.ResourceNotFoundException;
import com.github.TheBrainfucker.Fanhub.model.User;
import com.github.TheBrainfucker.Fanhub.repository.UserRepository;
import com.github.TheBrainfucker.Fanhub.service.impl.UserServiceImpl;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserServiceImpl userServiceImpl;

    // get all users
    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
    }

    // create user rest api
    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            return new ResponseEntity<>(userRepository.save(user), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // get user by id rest api
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User (id:" + id + ") not found!"));
        return ResponseEntity.ok(user);
    }

    // get any user profile by username
    @GetMapping("/profile")
    public ResponseEntity<User> getUserByUsername(@RequestParam("username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(username + " not found"));

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // update user rest api
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User (id:" + id + ") not found!"));

        user.setEmail(userDetails.getEmail());
        user.setUsername(userDetails.getUsername());
        user.setName(userDetails.getName());

        User updateUser = userRepository.save(user);
        return ResponseEntity.ok(updateUser);
    }

    // @PutMapping("/{username}")
    // public ResponseEntity<User> updateUser(@PathVariable("username") String
    // username,
    // @RequestBody User userDetails) {
    // User user = userRepository.findById(userDetails.getId())
    // .orElseThrow(() -> new ResourceNotFoundException(username + " not found"));

    // user.setEmail(userDetails.getEmail());
    // user.setUsername(userDetails.getUsername());
    // user.setName(userDetails.getName());

    // return new ResponseEntity<>(userRepository.save(user), HttpStatus.OK);
    // }

    // delete user rest api
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User (id:" + id + ") not found!"));

        userRepository.delete(user);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    // @DeleteMapping("/{username}")
    // public ResponseEntity<HttpStatus> deleteUser(@PathVariable("username") String
    // username) {
    // userRepository.deleteByUsername(username);

    // return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    // }

    @DeleteMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteAllUsers() {
        userRepository.deleteAll();

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/fans/{id}")
    public ResponseEntity<Set<User>> getFans(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User (id:" + id + ") not found!"));
        return new ResponseEntity<>(user.getFans(), HttpStatus.OK);
    }

    @GetMapping("/subscriptions/{id}")
    public ResponseEntity<Set<User>> getSubscriptions(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User (id:" + id + ") not found!"));
        return new ResponseEntity<>(user.getSubscriptions(), HttpStatus.OK);
    }

    // @GetMapping("/fanids/{id}")
    // public ResponseEntity<Set<Long>> getFanids(@PathVariable Long id) {
    // User user = userRepository.findById(id)
    // .orElseThrow(() -> new ResourceNotFoundException("User (id:" + id + ") not
    // found!"));
    // return new ResponseEntity<>(user.getFanIds(), HttpStatus.OK);
    // }

    // @GetMapping("/subscriptionids/{id}")
    // public ResponseEntity<List<String>> getSubscriptionids(@PathVariable Long id)
    // {
    // User user = userRepository.findById(id)
    // .orElseThrow(() -> new ResourceNotFoundException("User (id:" + id + ") not
    // found!"));
    // System.out.println(user.getSubscriptionIds());
    // return new ResponseEntity<>(user.getSubscriptionIds(), HttpStatus.OK);
    // }

    @PutMapping("/{creatorid}/subscribe/{fanid}")
    public ResponseEntity<String> subscribe(@PathVariable Long creatorid, @PathVariable Long fanid) {
        userServiceImpl.subscribe(fanid, creatorid);
        return ResponseEntity.ok("Subscribed");
    }

    @PutMapping("/{creatorid}/unsubscribe/{fanid}")
    public ResponseEntity<String> unsubscribe(@PathVariable Long creatorid, @PathVariable Long fanid) {
        userServiceImpl.unsubscribe(fanid, creatorid);
        return ResponseEntity.ok("Unsubscribed");
    }

    @GetMapping("/suggestions/{fanid}")
    public ResponseEntity<Set<User>> getSuggestions(@PathVariable Long fanid) {
        User user = userRepository.findById(fanid)
                .orElseThrow(() -> new ResourceNotFoundException("User (id:" + fanid + ") not found!"));
        Set<Long> subscriptionids = user.getSubscriptionIds();
        subscriptionids.add(user.getId());
        Set<User> suggestions = userServiceImpl.getSuggestions(subscriptionids);
        return ResponseEntity.ok(suggestions);
    }

}
