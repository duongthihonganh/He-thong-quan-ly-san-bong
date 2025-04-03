import streamlit as st
import pandas as pd
import numpy as np
import datetime
import auth
import data
import os

# Page configuration
st.set_page_config(
    page_title="Football Field Management System",
    page_icon="⚽",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load custom CSS
def load_css():
    with open("style.css") as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

# Initialize session state for data if not already done
if 'initialized' not in st.session_state:
    data.initialize_data()
    st.session_state.initialized = True

# Authentication
if 'authenticated' not in st.session_state:
    st.session_state.authenticated = False
    st.session_state.username = ""

# Main web function
def main():
    # Load CSS
    load_css()
    
    # Hide Streamlit default elements
    hide_streamlit_style = """
        <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            .stDeployButton {display:none;}
            .css-1rs6os {visibility: hidden;}
            .css-17ziqus {visibility: hidden;}
            .stActionButton {visibility: hidden;}
            .viewerBadge_container__r5tak {display: none;}
            .styles_terminalButton__JBj5s {display: none;}
        </style>
    """
    st.markdown(hide_streamlit_style, unsafe_allow_html=True)
    
    # If not authenticated, show login page
    if not st.session_state.authenticated:
        auth.login_page()
    else:
        # Navigation bar
        st.markdown('''<header>
            <div class="navbar">
                <a href="#" class="navbar-brand">⚽ Football Field Management</a>
                <ul class="navbar-menu">
                    <li class="navbar-item"><a href="#" class="navbar-link active">Dashboard</a></li>
                    <li class="navbar-item"><a href="#" class="navbar-link">Bookings</a></li>
                    <li class="navbar-item"><a href="#" class="navbar-link">Fields</a></li>
                    <li class="navbar-item"><a href="#" class="navbar-link">Customers</a></li>
                    <li class="navbar-item"><a href="#" class="navbar-link">Reports</a></li>
                </ul>
            </div>
        </header>''', unsafe_allow_html=True)
        
        # Main content container
        st.markdown('<div class="content-container">', unsafe_allow_html=True)
        
        # Welcome section with user info
        st.markdown(f'''
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <div>
                <h1 style="margin-bottom: 5px;">Dashboard</h1>
                <p style="color: #666;">Welcome back, <strong>{st.session_state.username}</strong>! Here's what's happening today.</p>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0; color: #666;">{datetime.datetime.now().strftime('%A, %B %d, %Y')}</p>
                <p style="margin: 0; color: #4CAF50; font-weight: 500;">Role: {st.session_state.get('user_role', '').title()}</p>
            </div>
        </div>
        ''', unsafe_allow_html=True)
        
        # Dashboard statistics in grid layout
        st.markdown('<div class="dashboard-grid">', unsafe_allow_html=True)
        # Optimized Card layout: 2 rows, 2 columns with smaller card sizes
        st.markdown('''
        <style>
            .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            }
            .dashboard-card {
            background: #ffffff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .dashboard-card h4 {
            margin-bottom: 10px;
            font-size: 18px;
            color: #444;
            }
            .dashboard-card h2 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
            }
            .dashboard-card p {
            margin: 0;
            margin-top: 10px;
            font-size: 14px;
            color: #888;
            }
        </style>
        ''', unsafe_allow_html=True)

        # Cards in a grid layout
        st.markdown(f'''
        <div class="dashboard-grid">
            <div class="dashboard-card">
            <h4>Total Fields</h4>
            <h2 style="color: #4CAF50;">{len(st.session_state.fields)}</h2>
            <p><span style="color: #4CAF50;">▲ 5%</span> from last month</p>
            </div>
            <div class="dashboard-card">
            <h4>Today's Bookings</h4>
            <h2 style="color: #2196F3;">{sum(1 for booking in st.session_state.bookings if pd.to_datetime(booking['date']).date() == datetime.datetime.now().date())}</h2>
            <p><span style="color: #2196F3;">↔ 0%</span> same as yesterday</p>
            </div>
            <div class="dashboard-card">
            <h4>Registered Customers</h4>
            <h2 style="color: #FF9800;">{len(st.session_state.customers)}</h2>
            <p><span style="color: #FF9800;">▲ 12%</span> from last month</p>
            </div>
            <div class="dashboard-card">
            <h4>Active Staff</h4>
            <h2 style="color: #F44336;">{len(st.session_state.staff)}</h2>
            <p><span style="color: #F44336;">▲ 2%</span> from last month</p>
            </div>
        </div>
        ''', unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)  # Close dashboard-grid
        
        # Fields Status Table
        st.markdown('''<div class="card">
            <div class="card-header">Football Fields Status</div>
        ''', unsafe_allow_html=True)
        
        # Create a DataFrame for field status
        field_data = []
        for field in st.session_state.fields:
            # Assuming we have a status field in each field, which could be 'Available', 'Booked', or 'Maintenance'
            field_status = field.get('status', 'Available')  # Default to 'Available'
            field_data.append([field['name'], field_status])
        
        field_df = pd.DataFrame(field_data, columns=['Field Name', 'Status'])
        
        # Display table with the status of each field
        if not field_df.empty:
            st.write(field_df)
        else:
            st.markdown('''<div style="text-align: center; padding: 30px 0;">
                <span>No fields available</span>
            </div>''', unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)  # Close card
        
        # Handle logout
        if st.button("Logout"):
            st.session_state.authenticated = False
            st.session_state.username = ""
            st.session_state.user_role = ""
            st.experimental_rerun()
        
        st.markdown('</div>', unsafe_allow_html=True)  # Close content-container

if __name__ == "__main__":
    main()
