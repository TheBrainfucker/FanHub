package com.github.TheBrainfucker.Fanhub.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "caption")
    private String caption;

    @Column(name = "content")
    private String content;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "love", nullable = false)
    private Long love;

    @ManyToOne
    @JoinColumn(name = "userid")
    private User user;

    public Post() {
    }

    public Post(String caption, String content, LocalDateTime date, User user) {
        super();
        this.caption = caption;
        this.content = content;
        this.date = date;
        this.user = user;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = LocalDateTime.parse(date);
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setLove(Long love) {
        this.love = love;
    }

    public Long getLove() {
        return love;
    }

}
