<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<%@ include file="include/header.jsp" %>
<section class="hero is-primary">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
            	다용도 커뮤니티 입니다.
            </h1>
            <h2 class="subtitle">
                단시간 개발시를 위해 틀을 잡는 용도로 만들었습니다.
            </h2>
        </div>
    </div>
</section>
<c:if test="${ success eq true }">
	<div class="notification is-success container" style="margin-top: 10px;">
	  <button class="delete"></button>
	  성공적으로 게시가 완료되었습니다.
	</div>
</c:if>
<div class="container" style="margin-top: 40px;">
    <div class="tabs" style="margin-bottom: 15px;">
        <ul>
            <li class="is-active"><a>모든 게시글</a></li>
            <li><a>인기 게시물</a></li>
            <li><a>갤러리</a></li>
            <li><a>500자 이상</a></li>
            <li><a href="/board/register">게시물 작성</a></li>
        </ul>
    </div>
    <div>
	    <table class="table is-fullwidth is-narrow is-striped">
	        <thead>
	            <tr>
	                <td style="width:5%">#</td>
	                <td style="width:65%">재목</td>
	                <td style="">작성자</td>
	                <td style="">작성일</td>
	                <td style="">조회수</td>
	            </tr>
	        </thead>
	        <tbody>
	        	<c:forEach items="${ list }" var="boardVO">
	            <tr>
	                <td>${ boardVO.bno }</td>
	                <td><a href="/board/read/${ boardVO.bno }">${ boardVO.title }</a></td>
	                <td>${ boardVO.writer }</td>
	                <td><fmt:formatDate pattern="yy-MM-dd HH:mm" value="${ boardVO.regdate }" /></td>
	                <td>${ boardVO.viewcnt }</td>
	            </tr>
	            </c:forEach>
	        </tbody>
	    </table>
	    <nav class="pagination is-small" role="navigation" aria-label="pagination">
		  <c:if test="${ pageMaker.prev }">
		  	<a href="/board/list/${ pageMaker.startPage - 1 }" class="pagination-previous">PREV</a>
		  </c:if>
		  <c:if test="${ pageMaker.next }">
		  	<a href="/board/list/${ pageMaker.endPage + 1 }" class="pagination-next">NEXT</a>
		  </c:if>
		  <ul class="pagination-list">
		  	<c:forEach begin="${ pageMaker.startPage }" end="${ pageMaker.endPage }" var="idx">
		  		<li><a href="/board/list/${ idx }" class="pagination-link<c:out value="${ pageMaker.pageCriteria.page == idx ? ' is-current' : '' }"/>">${ idx }</a></li>
		  	</c:forEach>
		  </ul>
		</nav>
    </div>
</div>
<%@ include file="include/footer.jsp" %>