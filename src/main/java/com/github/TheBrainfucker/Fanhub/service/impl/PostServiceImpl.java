package com.github.TheBrainfucker.Fanhub.service.impl;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.github.TheBrainfucker.Fanhub.model.Post;
import com.github.TheBrainfucker.Fanhub.model.User;
import com.github.TheBrainfucker.Fanhub.repository.PostRepository;
import com.github.TheBrainfucker.Fanhub.service.PostService;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImpl implements PostService<Post> {

    @Autowired
    private PostRepository postRepository;

    @Override
    public Collection<Post> findAll() {
        return postRepository.findAll();
    }

    @Override
    public Optional<Post> findById(Long id) {
        return postRepository.findById(id);
    }

    @Override
    public Post saveOrUpdate(Post post) {
        return postRepository.saveAndFlush(post);
    }

    @Override
    public String deleteById(Long id) {
        JSONObject jsonObject = new JSONObject();
        try {
            postRepository.deleteById(id);
            jsonObject.put("message", "Post deleted successfully");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }

    public Set<Post> getFeed(User user) {
        Set<User> subscriptions = user.getSubscriptions();
        subscriptions.add(user);
        Set<Long> ids = subscriptions.stream().map(User::getId).collect(Collectors.toSet());
        return postRepository.findTop100ByUser_IdInOrderByDateDesc(ids);
    }

}
