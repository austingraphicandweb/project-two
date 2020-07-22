$(document).ready(function() {
    const signupForm = $('#signupForm');
    const firstNameInput = $('#firstName');
    const lastNameInput = $('#lastName');
    const newEmailInput = $('#newEmail')
    const newUsernameInput = $('#newUsername');
    const newPasswordInput = $('#newPassword');
    const confirmPasswordInput = $('#confirmPassword');
  
    signupForm.on('submit', function(event) {
      event.preventDefault();
      const userData = {
        username: newUsernameInput.val().trim(),
        email: newEmailInput.val().trim(),
        password: newPasswordInput.val().trim(),
        firstName: firstNameInput.val().trim(),
        lastName: lastNameInput.val().trim()
      };
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.username || !userData.password) {
        return;
      };
      if (userData.password !== confirmPasswordInput.val().trim()) {
        toastr.error("Password confirmation must match")
        return;
      };
      if (userData.email === "email"){
        toastr.error("this account already exists")
      };
      signUpUser(userData);
      firstNameInput.val('');
      lastNameInput.val('');
      newEmailInput.val('');
      newUsernameInput.val('');
      newPasswordInput.val('');
      confirmPasswordInput.val('');
    });

    function signUpUser(newUser) {
      $.post('/users/signup', newUser)
        .then(res => {
          localStorage.setItem('sessionToken', res.sessionToken);
          document.cookie = `sessionToken=${res.sessionToken}`;
          toastr.success("Account creation successful");
          setTimeout(() => window.location.replace('/memories'), 2000);
        })
        .catch(err => {
          const errorMsg = JSON.parse(err.responseText)
          errorMsg.err.forEach(e => {
            if(e.path == "username") {
              toastr.error("username must have minimum 5 chars")
            }else if(e.path == "password") {
              toastr.error("password must have minimum 8 chars")
            }else if(e.path == "users.username") {
              toastr.error("username already exists")
            }else if(e.path == "email") {
              toastr.error("email must be a valid email address")
            }else if(e.path == "firstName") {
              toastr.error("please enter a first name between 1 and 140 characters")
            }else if(e.path == "lastName") {
              toastr.error("please enter a last name between 1 and 140 characters")
            }
          })
        });
    };
}); 