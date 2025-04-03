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
        st.markdown('''
        <header>
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
        </header>
        ''', unsafe_allow_html=True)
        
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
        
        # Card 1: Total Fields
        st.markdown(f'''
        <div class="dashboard-card">
            <h4>Total Fields</h4>
            <h2 style="color: #4CAF50;">{len(st.session_state.fields)}</h2>
            <p style="margin-top: 10px; color: #777; font-size: 14px;">
                <span style="color: #4CAF50;">▲ 5%</span> from last month
            </p>
        </div>
        ''', unsafe_allow_html=True)
        
        # Card 2: Today's Bookings
        today = datetime.datetime.now().date()
        today_bookings = sum(1 for booking in st.session_state.bookings if 
                          pd.to_datetime(booking['date']).date() == today)
        st.markdown(f'''
        <div class="dashboard-card">
            <h4>Today's Bookings</h4>
            <h2 style="color: #2196F3;">{today_bookings}</h2>
            <p style="margin-top: 10px; color: #777; font-size: 14px;">
                <span style="color: #2196F3;">↔ 0%</span> same as yesterday
            </p>
        </div>
        ''', unsafe_allow_html=True)
        
        # Card 3: Registered Customers
        st.markdown(f'''
        <div class="dashboard-card">
            <h4>Registered Customers</h4>
            <h2 style="color: #FF9800;">{len(st.session_state.customers)}</h2>
            <p style="margin-top: 10px; color: #777; font-size: 14px;">
                <span style="color: #FF9800;">▲ 12%</span> from last month
            </p>
        </div>
        ''', unsafe_allow_html=True)
        
        # Card 4: Active Staff
        st.markdown(f'''
        <div class="dashboard-card">
            <h4>Active Staff</h4>
            <h2 style="color: #F44336;">{len(st.session_state.staff)}</h2>
            <p style="margin-top: 10px; color: #777; font-size: 14px;">
                <span style="color: #F44336;">▲ 2%</span> from last month
            </p>
        </div>
        ''', unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)  # Close dashboard-grid
        
        # Quick action buttons
        st.markdown('''
        <div style="margin: 30px 0;">
            <h3 style="margin-bottom: 15px;">Quick Actions</h3>
            <div style="display: flex; gap: 15px;">
                <a href="#" onclick="window.location.href='pages/booking_management.py'" class="btn btn-primary" style="text-decoration: none;">
                    <span style="margin-right: 8px;">➕</span> New Booking
                </a>
                <a href="#" onclick="window.location.href='pages/customer_management.py'" class="btn btn-primary" style="text-decoration: none;">
                    <span style="margin-right: 8px;">👤</span> Add Customer
                </a>
                <a href="#" onclick="window.location.href='pages/field_management.py'" class="btn btn-primary" style="text-decoration: none;">
                    <span style="margin-right: 8px;">🏟️</span> Add Field
                </a>
                <a href="#" onclick="window.location.href='pages/reports.py'" class="btn btn-secondary" style="text-decoration: none;">
                    <span style="margin-right: 8px;">📊</span> View Reports
                </a>
            </div>
        </div>
        ''', unsafe_allow_html=True)
        
        # Two column layout for recent bookings and field status
        col1, col2 = st.columns([2, 1])
        
        with col1:
            # Recent bookings section
            st.markdown('''
            <div class="card">
                <div class="card-header">Recent Bookings</div>
            ''', unsafe_allow_html=True)
            
            if st.session_state.bookings:
                # Sort bookings by date and time
                recent_bookings = sorted(
                    st.session_state.bookings,
                    key=lambda x: (pd.to_datetime(x['date']), x['start_time']),
                    reverse=True
                )[:5]
                
                # Create a DataFrame for display
                df = pd.DataFrame(recent_bookings)
                if not df.empty:
                    df['customer'] = df['customer_id'].apply(lambda x: next((c['name'] for c in st.session_state.customers if c['id'] == x), "Unknown"))
                    df['field'] = df['field_id'].apply(lambda x: next((f['name'] for f in st.session_state.fields if f['id'] == x), "Unknown"))
                    display_df = df[['date', 'start_time', 'end_time', 'customer', 'field', 'status']]
                    display_df.columns = ['Date', 'Start', 'End', 'Customer', 'Field', 'Status']
                    
                    # Build a custom HTML table
                    html_table = '''
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Customer</th>
                                    <th>Field</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                    '''
                    
                    for _, row in display_df.iterrows():
                        # Determine status class
                        status_class = ""
                        if row['Status'] == 'Confirmed':
                            status_class = "status status-confirmed"
                        elif row['Status'] == 'Pending':
                            status_class = "status status-pending"
                        elif row['Status'] == 'Cancelled':
                            status_class = "status status-cancelled"
                        
                        # Format time
                        time_str = f"{row['Start']} - {row['End']}"
                        
                        # Add row to table
                        html_table += f'''
                        <tr>
                            <td>{row['Date']}</td>
                            <td>{time_str}</td>
                            <td>{row['Customer']}</td>
                            <td>{row['Field']}</td>
                            <td><span class="{status_class}">{row['Status']}</span></td>
                            <td>
                                <a href="#" style="color: #4CAF50; margin-right: 10px;" title="View details">👁️</a>
                                <a href="#" style="color: #2196F3;" title="Edit booking">✏️</a>
                            </td>
                        </tr>
                        '''
                    
                    html_table += '''
                            </tbody>
                        </table>
                    </div>
                    <div style="text-align: right; margin-top: 15px;">
                        <a href="#" style="color: #4CAF50; text-decoration: none; font-weight: 500;">
                            View All Bookings →
                        </a>
                    </div>
                    '''
                    
                    st.markdown(html_table, unsafe_allow_html=True)
            else:
                st.markdown('''
                <div style="text-align: center; padding: 30px 0;">
                    <img src="https://img.icons8.com/color/96/000000/calendar.png" style="opacity: 0.5; width: 48px;">
                    <p style="color: #777; margin-top: 10px;">No bookings available yet.</p>
                    <a href="pages/booking_management.py" class="btn btn-primary" style="margin-top: 10px; display: inline-block; text-decoration: none;">
                        Create First Booking
                    </a>
                </div>
                ''', unsafe_allow_html=True)
            
            st.markdown('</div>', unsafe_allow_html=True)  # Close card
        
        with col2:
            # Field status card
            st.markdown('''
            <div class="card">
                <div class="card-header">Field Status</div>
                <div style="margin-top: 15px;">
            ''', unsafe_allow_html=True)
            
            # Display status of each field
            if st.session_state.fields:
                for field in st.session_state.fields:
                    # Determine if field is currently booked
                    now = datetime.datetime.now()
                    today_str = now.strftime("%Y-%m-%d")
                    current_time = now.strftime("%H:%M")
                    
                    is_booked = False
                    for booking in st.session_state.bookings:
                        if (booking['field_id'] == field['id'] and 
                            booking['date'] == today_str and 
                            booking['start_time'] <= current_time <= booking['end_time'] and
                            booking['status'] == 'Confirmed'):
                            is_booked = True
                            booked_by = next((c['name'] for c in st.session_state.customers if c['id'] == booking['customer_id']), "Unknown")
                            break
                    
                    # Field card with status
                    status_text = "Available"
                    status_color = "#4CAF50"
                    status_info = "Ready for booking"
                    
                    if is_booked:
                        status_text = "Booked"
                        status_color = "#F44336"
                        status_info = f"Booked by {booked_by}"
                    elif field['status'] == 'Maintenance':
                        status_text = "Maintenance"
                        status_color = "#FF9800"
                        status_info = "Under maintenance"
                    
                    st.markdown(f'''
                    <div style="display: flex; align-items: center; background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                        <div style="width: 15px; height: 15px; border-radius: 50%; background-color: {status_color}; margin-right: 15px;"></div>
                        <div style="flex-grow: 1;">
                            <h4 style="margin: 0; font-size: 16px;">{field['name']}</h4>
                            <p style="margin: 0; color: #777; font-size: 12px;">{status_info}</p>
                        </div>
                        <div>
                            <span style="font-weight: 500; color: {status_color};">{status_text}</span>
                        </div>
                    </div>
                    ''', unsafe_allow_html=True)
            else:
                st.markdown('''
                <div style="text-align: center; padding: 30px 0;">
                    <img src="https://img.icons8.com/color/96/000000/football-field.png" style="opacity: 0.5; width: 48px;">
                    <p style="color: #777; margin-top: 10px;">No fields available yet.</p>
                    <a href="pages/field_management.py" class="btn btn-primary" style="margin-top: 10px; display: inline-block; text-decoration: none;">
                        Add First Field
                    </a>
                </div>
                ''', unsafe_allow_html=True)
            
            st.markdown('''
                </div>
            </div>
            ''', unsafe_allow_html=True)  # Close card
            
            # Calendar card
            st.markdown('''
            <div class="card" style="margin-top: 20px;">
                <div class="card-header">Today's Schedule</div>
                <div style="padding: 15px 0; text-align: center;">
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">{}</div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #777;">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px;">
            '''.format(datetime.datetime.now().strftime('%B %Y')), unsafe_allow_html=True)
            
            # Generate calendar days
            now = datetime.datetime.now()
            month_start = datetime.datetime(now.year, now.month, 1)
            month_end = (datetime.datetime(now.year, now.month + 1, 1) if now.month < 12 
                         else datetime.datetime(now.year + 1, 1, 1)) - datetime.timedelta(days=1)
            
            # Add empty days before start of month
            start_weekday = month_start.weekday()  # Monday is 0
            for _ in range(start_weekday):
                st.markdown('''
                <div style="height: 30px; display: flex; justify-content: center; align-items: center; color: #ddd;">
                    ·
                </div>
                ''', unsafe_allow_html=True)
            
            # Add actual days
            for day in range(1, month_end.day + 1):
                day_date = datetime.datetime(now.year, now.month, day)
                is_today = day == now.day
                
                # Count bookings for this day
                day_str = day_date.strftime("%Y-%m-%d")
                day_bookings = sum(1 for booking in st.session_state.bookings if booking['date'] == day_str)
                
                # Styles for the day
                background = "#E8F5E9" if is_today else "white"
                border = "2px solid #4CAF50" if is_today else "1px solid #eee"
                
                st.markdown(f'''
                <div style="height: 30px; display: flex; justify-content: center; align-items: center; 
                      background-color: {background}; border-radius: 50%; border: {border}; position: relative;">
                    {day}
                    {f'<span style="position: absolute; bottom: -3px; right: -3px; background-color: #4CAF50; color: white; border-radius: 50%; width: 15px; height: 15px; font-size: 10px; display: flex; justify-content: center; align-items: center;">{day_bookings}</span>' if day_bookings > 0 else ''}
                </div>
                ''', unsafe_allow_html=True)
            
            st.markdown('''
                    </div>
                    <div style="margin-top: 20px;">
                        <a href="pages/booking_management.py" style="color: #4CAF50; text-decoration: none; font-weight: 500;">
                            View Full Calendar →
                        </a>
                    </div>
                </div>
            </div>
            ''', unsafe_allow_html=True)  # Close card
        
        # Footer
        st.markdown('''
        <footer>
            <div style="display: flex; justify-content: center; margin-bottom: 10px;">
                <a href="#" style="margin: 0 10px; color: #777; text-decoration: none;">Home</a>
                <a href="#" style="margin: 0 10px; color: #777; text-decoration: none;">About</a>
                <a href="#" style="margin: 0 10px; color: #777; text-decoration: none;">Services</a>
                <a href="#" style="margin: 0 10px; color: #777; text-decoration: none;">Contact</a>
                <a href="#" style="margin: 0 10px; color: #777; text-decoration: none;">Help & Support</a>
            </div>
            <p>© 2025 Football Field Management System. All rights reserved.</p>
        </footer>
        ''', unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)  # Close content-container
        
        # Floating logout button
        st.markdown('''
        <div id="logout-button" style="position: fixed; top: 15px; right: 20px; z-index: 9999;">
            <button onclick="logout()" style="background-color: #f8f9fa; border: none; border-radius: 20px; padding: 5px 12px; 
            display: flex; align-items: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <span style="margin-right: 5px; color: #555;">{}</span>
                <span style="color: #555; font-size: 14px;">Logout</span>
            </button>
        </div>
        <script>
        function logout() {{
            // This will be handled by Streamlit's event system
            console.log("Logout clicked");
            const elements = window.parent.document.querySelectorAll('button');
            for (const element of elements) {{
                if (element.innerText === "Logout") {{
                    element.click();
                    break;
                }}
            }}
        }}
        </script>
        '''.format(st.session_state.username), unsafe_allow_html=True)
        
        # Hidden logout button for the JavaScript to click
        if st.button("Logout", key="logout_hidden", help="Logout of your account"):
            st.session_state.authenticated = False
            st.session_state.username = ""
            st.session_state.user_role = ""
            st.rerun()

if __name__ == "__main__":
    main()

