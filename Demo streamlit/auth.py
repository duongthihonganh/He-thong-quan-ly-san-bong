
import streamlit as st
import hashlib

# Simple user data for authentication
default_users = [
    {"username": "admin", "password": hashlib.sha256("admin123".encode()).hexdigest(), "role": "admin"},
    {"username": "staff", "password": hashlib.sha256("staff123".encode()).hexdigest(), "role": "staff"}
]

def login_page():
    """Display the login page for authentication"""
    # Load CSS if available
    try:
        with open("style.css") as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
    except:
        pass
    
    # Hide Streamlit default elements
    hide_streamlit_style = """
        <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            .stDeployButton {display:none;}
            .css-1rs6os {visibility: hidden;}
            .css-17ziqus {visibility: hidden;}
            .stActionButton {visibility: hidden;}
        </style>
    """
    st.markdown(hide_streamlit_style, unsafe_allow_html=True)

    # Navbar
    st.markdown('''
    <header>
        <div class="navbar">
            <a href="#" class="navbar-brand">⚽ Football Field Management</a>
            <ul class="navbar-menu">
                <li class="navbar-item"><a href="#" class="navbar-link">Home</a></li>
                <li class="navbar-item"><a href="#" class="navbar-link">About</a></li>
                <li class="navbar-item"><a href="#" class="navbar-link">Contact</a></li>
            </ul>
        </div>
    </header>
    ''', unsafe_allow_html=True)
    
    # Initialize users in session state if not already done
    if 'users' not in st.session_state:
        st.session_state.users = default_users
    
    # Login Container
    st.markdown('''
    <div class="content-container" style="margin-top: 50px;">
        <div class="login-container">
            <div class="login-card">
                <div class="login-logo">
                    <img src="https://img.icons8.com/color/96/000000/football2--v1.png" alt="Football Logo" style="width: 80px;">
                </div>
                <div class="login-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account</p>
                </div>
            </div>
        </div>
    </div>
    ''', unsafe_allow_html=True)
    
    # Create a centered container for the login form
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        # Create a form for login with styling
        with st.form("login_form"):
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            
            # Remember me and forgot password
            col1, col2 = st.columns(2)
            with col1:
                remember = st.checkbox("Remember me")
            with col2:
                st.markdown('<p style="text-align: right;"><a href="#" style="color: #4CAF50; text-decoration: none; font-size: 14px;">Forgot Password?</a></p>', unsafe_allow_html=True)
            
            # Login button
            submit_button = st.form_submit_button("Sign In")
            
            if submit_button:
                # Hash the entered password
                hashed_password = hashlib.sha256(password.encode()).hexdigest()
                
                # Check credentials
                for user in st.session_state.users:
                    if user["username"] == username and user["password"] == hashed_password:
                        st.session_state.authenticated = True
                        st.session_state.username = username
                        st.session_state.user_role = user["role"]
                        
                        # Success message with web-like notification
                        st.markdown('''
                        <div style="position: fixed; top: 20px; right: 20px; background-color: #4CAF50; color: white; padding: 15px; 
                        border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 9999; animation: slideIn 0.5s ease-out;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 10px;">✓</span>
                                <span>Login successful! Redirecting...</span>
                            </div>
                        </div>
                        <style>
                            @keyframes slideIn {
                                from { transform: translateX(100%); opacity: 0; }
                                to { transform: translateX(0); opacity: 1; }
                            }
                        </style>
                        ''', unsafe_allow_html=True)
                        
                        st.rerun()
                        break
                else:
                    # Error message with web-like notification
                    st.markdown('''
                    <div style="position: fixed; top: 20px; right: 20px; background-color: #F44336; color: white; padding: 15px; 
                    border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); z-index: 9999; animation: slideIn 0.5s ease-out;">
                        <div style="display: flex; align-items: center;">
                            <span style="margin-right: 10px;">✕</span>
                            <span>Invalid username or password</span>
                        </div>
                    </div>
                    <style>
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    </style>
                    ''', unsafe_allow_html=True)
        
        # Divider
        st.markdown('<div style="text-align: center; margin: 20px 0;"><span style="color: #777; font-size: 14px;">OR</span></div>', unsafe_allow_html=True)
        
        # Social login buttons
        col1, col2 = st.columns(2)
        with col1:
            st.markdown('''
            <button style="width: 100%; padding: 10px; background-color: #3b5998; color: white; border: none; border-radius: 5px; 
            cursor: pointer; display: flex; justify-content: center; align-items: center;">
                <img src="https://img.icons8.com/color/24/000000/facebook-new.png" style="margin-right: 10px;"> Facebook
            </button>
            ''', unsafe_allow_html=True)
        with col2:
            st.markdown('''
            <button style="width: 100%; padding: 10px; background-color: #db4a39; color: white; border: none; border-radius: 5px; 
            cursor: pointer; display: flex; justify-content: center; align-items: center;">
                <img src="https://img.icons8.com/color/24/000000/google-logo.png" style="margin-right: 10px;"> Google
            </button>
            ''', unsafe_allow_html=True)
    
    # Demo credentials
    st.markdown('''
    <div style="max-width: 400px; margin: 20px auto; padding: 15px; background-color: #F8F9FA; border-radius: 5px; text-align: center;">
        <h4 style="color: #4CAF50; margin-top: 0;">Demo Credentials</h4>
        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
            <div style="text-align: center; flex: 1; padding: 10px; background-color: white; border-radius: 5px; margin-right: 5px;">
                <p style="font-weight: 600; margin: 0;">Admin</p>
                <p style="margin: 5px 0;">Username: admin</p>
                <p style="margin: 5px 0;">Password: admin123</p>
            </div>
            <div style="text-align: center; flex: 1; padding: 10px; background-color: white; border-radius: 5px; margin-left: 5px;">
                <p style="font-weight: 600; margin: 0;">Staff</p>
                <p style="margin: 5px 0;">Username: staff</p>
                <p style="margin: 5px 0;">Password: staff123</p>
            </div>
        </div>
    </div>
    ''', unsafe_allow_html=True)
    
    # Add a footer
    st.markdown('''
    <footer>
        <div style="display: flex; justify-content: center; margin-bottom: 10px;">
            <a href="#" style="margin: 0 10px; color: #777; text-decoration: none;">Home</a>
            <a href="#" style="margin: 0 10px; color: #777; text-decoration: none;">About</a>
            <a href="#" style="margin: 0 10px; color: #777; text-decoration: none;">Services</a>
            <a href="#" style="margin: 0 10px; color: #777; text-decoration: none;">Contact</a>
        </div>
        <p>© 2025 Football Field Management System. All rights reserved.</p>
    </footer>
    ''', unsafe_allow_html=True)

def check_authentication():
    """Check if the user is authenticated"""
    return st.session_state.get('authenticated', False)

def logout():
    """Log out the current user"""
    st.session_state.authenticated = False
    st.session_state.username = ""
    st.session_state.user_role = ""
