<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../include/header.jsp" %>
<section>
	<div class="p-md-5 p-3">
		<h1>회원가입</h1>
	</div>
	<div class="row justify-content-center align-self-center">
		<form name="register" action="/auth/registerProcess" method="POST" class="col-md-7 col-sm-10 py-md-5" style="max-width: 600px;">
			<div class="form-group row">
				<label for="user_id" class="col-sm-4 col-form-label">Username</label>
				<div class="col-sm-12">
					<input type="text" class="form-control" id="user_id" name="user_id" placeholder="Username">
				</div>
				<label for="user_name" class="col-sm-4 col-form-label">Realname</label>
				<div class="col-sm-12">
					<input type="text" class="form-control" id="user_name" name="user_name" placeholder="Realname">
				</div>
				<label for="user_pw" class="col-sm-4 col-form-label">Password</label>
				<div class="col-sm-12">
					<input type="password" class="form-control" id="user_pw" name="user_pw" placeholder="Password">
				</div>
				<label for="user_pw_conf" class="col-sm-4 col-form-label">Password Confirm</label>
				<div class="col-sm-12">
					<input type="password" class="form-control" id="user_pw_conf" name="user_pw_conf" placeholder="Password Confirm">
				</div>
			</div>
			<div class="form-group row">
				<div class="col-sm-12">
					<button type="submit" class="btn btn-success w-100">Sign up</button>
				</div>
			</div>
			<input type="hidden" name="${ _csrf.parameterName }" value="${ _csrf.token }">
		</form>
	</div>
</section>
<%@ include file="../include/footer.jsp" %>