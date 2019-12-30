<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>


<%@ include file="include/header.jsp" %>
<section class="hero is-info">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                글 수정 페이지 입니다.
            </h1>
            <h2 class="subtitle">
                글 작성시에 매너를 지켜주세요!
            </h2>
        </div>
    </div>
</section>

<div class="container" style="margin-top: 50px;">
	<form method="post" action="/board/modify/${ boardVO.bno }">
	    <div class="field">
	        <label class="label">Title</label>
	        <div class="control">
	            <input name="title" class="input is-info" type="text" placeholder="제목을 입력해주세요." value="${ boardVO.title }">
	        </div>
	    </div>
	    <div class="field">
	        <label class="label">Content</label>
	        <div class="control">
	            <textarea name="content" class="textarea is-info has-fixed-size" placeholder="컨텐츠를 입력해주세요." rows="15">${ boardVO.content }</textarea>
	        </div>
	        <p class="help">욕설, 모욕, 차별발언, 정치성향의 게시물은 자제해주시길 바랍니다.</p>
	    </div>
	    <div class="box" style="box-shadow: inset 0 1px 2px rgba(10,10,10,.1); border: 1px solid #209cee">
	        <div class="field is-grouped">
	            <div class="control">
	                <button type="submit" class="button is-link">완료</button>
	            </div>
	            <div class="control">
	                <button class="button">취소</button>
	            </div>
	        </div>
	    </div>
    </form>
</div>

<%@ include file="include/footer.jsp" %>