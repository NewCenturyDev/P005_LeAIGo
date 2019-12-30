<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ include file="include/header.jsp" %>
<hr class="is-marginless">
<section class="section">
    <div class="container" style="margin-top: 50px;">
        <h1 class="title">${ boardVO.title }</h1>
        <h2 class="subtitle">인기 게시물</h2>
        <div style="margin-top: 5px; height:27px">
            <div class="is-pulled-left">
                <span class="icon is-small">
                    <span class="fa-cube">
                        <i class="fas fa-cube"></i>
                    </span>
                </span>
                <strong>${ boardVO.writer }</strong>
            </div>
            <div class="is-pulled-right">
            	<span style="padding: 0px 5px; line-height: 29px;">#${ boardVO.bno }</span>
                <a href="/board/modify/${ boardVO.bno }" class="button is-small is-info">수정</a>
                <a href="/board/remove/${ boardVO.bno }" class="button is-small is-danger">삭제</a>
            </div>
        </div>
        <hr style="margin-top: 5px;">
        <div style="color: #333; min-height: 200px;">${ boardVO.content }</div>
        <hr>
        <article class="media">
            <div class="media-content">
                <div class="field">
                    <div style="margin-bottom: 5px;">
                        <span class="icon is-small">
                            <span class="fa-cube">
                                <i class="fas fa-cube"></i>
                            </span>
                        </span>
                        <strong>운영자</strong>
                    </div>
                    <p class="control">
                        <textarea class="textarea" placeholder="Add a comment..." rows="2"></textarea>
                    </p>
                </div>
                <nav class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <a class="button is-info">Submit</a>
                        </div>
                    </div>
                </nav>
            </div>
        </article>
        <article class="media">
            <div class="media-content">
                <div class="content">
                    <p>
                        <span class="icon is-small">
                            <span class="fa-cube">
                                <i class="fas fa-cube"></i>
                            </span>
                        </span>
                        <strong>운영자</strong> <small>31m</small>
                        <br>
                        너무너무 좋아요!!
                    </p>
                </div>
                <nav class="level is-mobile">
                    <div class="level-left">
                        <a class="level-item">
                            <span class="icon is-small"><i class="fas fa-reply"></i></span>
                        </a>
                        <a class="level-item">
                            <span class="icon is-small"><i class="fas fa-heart"></i></span>
                        </a>
                    </div>
                </nav>
            </div>
            <div class="media-right">
                <button class="delete"></button>
            </div>
        </article>
        <article class="media" style="padding-left: 60px;">
            <div class="media-content">
                <div class="content">
                    <p>
                        <span class="icon is-small">
                            <span class="fa-cube">
                                <i class="fas fa-cube"></i>
                            </span>
                        </span>
                        <strong>운영자</strong> <small>@운영자</small> <small>31m</small>
                        <br>
                        너무너무 좋아요!!
                    </p>
                </div>
                <nav class="level is-mobile">
                    <div class="level-left">
                        <a class="level-item">
                            <span class="icon is-small"><i class="fas fa-reply"></i></span>
                        </a>
                        <a class="level-item">
                            <span class="icon is-small"><i class="fas fa-heart"></i></span>
                        </a>
                    </div>
                </nav>
            </div>
            <div class="media-right">
                <button class="delete"></button>
            </div>
      	</article>
    </div>
</section>
<%@ include file="include/footer.jsp" %>