package com.github.TheBrainfucker.Fanhub.service.impl;

import java.util.HashSet;
import java.util.Set;

import javax.transaction.Transactional;

import com.github.TheBrainfucker.Fanhub.exception.ResourceNotFoundException;
import com.github.TheBrainfucker.Fanhub.model.User;
import com.github.TheBrainfucker.Fanhub.repository.UserRepository;
import com.github.TheBrainfucker.Fanhub.service.UserService;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService<User> {

    @Autowired
    private UserRepository userRepository;

    // @Override
    // public Collection<User> findAll() {
    // return userRepository.findAll();
    // }

    // @Override
    // public Optional<User> findById(Long id) {
    // return userRepository.findById(id);
    // }

    // @Override
    // public User saveOrUpdate(User user) {
    // return userRepository.saveAndFlush(user);
    // }

    @Override
    public String deleteById(Long id) {
        JSONObject jsonObject = new JSONObject();
        try {
            userRepository.deleteById(id);
            jsonObject.put("message", "User deleted successfully");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }

    // We are using the findById method to fetch our parent user and access the
    // collection inside within a Hibernate Session, which will be handled
    // automatically in the method's context by annotating it with @Transactional.
    @Transactional
    public void subscribe(Long fanid, Long creatorid) {
        User fan = userRepository.findById(fanid)
                .orElseThrow(() -> new ResourceNotFoundException("Fan id:" + fanid + ") not found!"));
        User creator = userRepository.findById(creatorid)
                .orElseThrow(() -> new ResourceNotFoundException("Creator id:" + creatorid + ") not found!"));
        fan.addFanSubscription(creator);
    }

    @Transactional
    public void unsubscribe(Long fanid, Long creatorid) {
        User fan = userRepository.findById(fanid)
                .orElseThrow(() -> new ResourceNotFoundException("Fan id:" + fanid + ") not found!"));
        User creator = userRepository.findById(creatorid)
                .orElseThrow(() -> new ResourceNotFoundException("Creator id:" + creatorid + ") not found!"));
        fan.removeFanSubscription(creator);
    }

    @Transactional
    public Set<User> getFans(Long creatorid) {
        User creator = userRepository.findById(creatorid)
                .orElseThrow(() -> new ResourceNotFoundException("User (id:" + creatorid + ") not found!"));
        return creator.getFans();
    }

    @Transactional
    public Set<User> getFollowing(Long fanid) {
        User fan = userRepository.findById(fanid)
                .orElseThrow(() -> new ResourceNotFoundException("User (id:" + fanid + ") not found!"));
        return fan.getFans();
    }

    public Set<User> getSuggestions(Set<Long> subscriptionIds) {
        Set<User> suggestions = userRepository.findByIdNotIn(
                subscriptionIds)
                .orElseThrow(() -> new ResourceNotFoundException("Suggestions not found!"));

        Set<User> newSuggestions = new HashSet<>();
        for (User suggestion : suggestions) {
            if (suggestion.getRole().getName().equals("USER")) {
                newSuggestions.add(suggestion);
            }
        }
        return newSuggestions;
    }
}