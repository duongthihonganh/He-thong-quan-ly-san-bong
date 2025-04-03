import streamlit as st
import pandas as pd
import datetime
import uuid
import locale
# Định dạng tiền tệ VND
def format_vnd(amount):
    """Định dạng số tiền theo kiểu tiền tệ VND"""
    return f"{amount:,.0f} VNĐ".replace(",", ".")

def initialize_data():
    """Initialize sample data structures in session state"""
    # Fields data
    if 'fields' not in st.session_state:
        st.session_state.fields = []
    
    # Bookings data
    if 'bookings' not in st.session_state:
        st.session_state.bookings = []
    
    # Staff data
    if 'staff' not in st.session_state:
        st.session_state.staff = []
    
    # Customers data
    if 'customers' not in st.session_state:
        st.session_state.customers = []
    
    # Services data
    if 'services' not in st.session_state:
        st.session_state.services = []

def generate_id():
    """Generate a unique ID for records"""
    return str(uuid.uuid4())[:8]

# Field management functions
def add_field(name, size, hourly_rate, description="", status="Available"):
    """Add a new field to the system"""
    field_id = generate_id()
    st.session_state.fields.append({
        "id": field_id,
        "name": name,
        "size": size,
        "hourly_rate": hourly_rate,
        "description": description,
        "status": status
    })
    return field_id

def update_field(field_id, name, size, hourly_rate, description, status):
    """Update an existing field's information"""
    for i, field in enumerate(st.session_state.fields):
        if field["id"] == field_id:
            st.session_state.fields[i] = {
                "id": field_id,
                "name": name,
                "size": size,
                "hourly_rate": hourly_rate,
                "description": description,
                "status": status
            }
            return True
    return False

def delete_field(field_id):
    """Delete a field by ID"""
    for i, field in enumerate(st.session_state.fields):
        if field["id"] == field_id:
            # Check if there are any bookings for this field
            bookings_for_field = [b for b in st.session_state.bookings if b["field_id"] == field_id]
            if bookings_for_field:
                return False, "Cannot delete field with existing bookings"
            del st.session_state.fields[i]
            return True, "Field deleted successfully"
    return False, "Field not found"

# Booking management functions
def add_booking(field_id, customer_id, date, start_time, end_time, services=None, status="Confirmed"):
    """Add a new booking to the system"""
    booking_id = generate_id()
    
    # Calculate total hours
    start_time_dt = datetime.datetime.strptime(start_time, "%H:%M")
    end_time_dt = datetime.datetime.strptime(end_time, "%H:%M")
    hours = (end_time_dt - start_time_dt).seconds / 3600
    
    # Get field hourly rate
    field = next((f for f in st.session_state.fields if f["id"] == field_id), None)
    if not field:
        return None, "Field not found"
    
    hourly_rate = field["hourly_rate"]
    
    # Calculate service costs
    service_cost = 0
    if services:
        for service_id in services:
            service = next((s for s in st.session_state.services if s["id"] == service_id), None)
            if service:
                service_cost += service["price"]
    
    # Calculate total cost
    total_cost = (hours * hourly_rate) + service_cost
    
    st.session_state.bookings.append({
        "id": booking_id,
        "field_id": field_id,
        "customer_id": customer_id,
        "date": date,
        "start_time": start_time,
        "end_time": end_time,
        "hours": hours,
        "services": services if services else [],
        "total_cost": total_cost,
        "status": status,
        "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    
    return booking_id, "Booking created successfully"

def update_booking(booking_id, field_id, customer_id, date, start_time, end_time, services, status):
    """Update an existing booking's information"""
    for i, booking in enumerate(st.session_state.bookings):
        if booking["id"] == booking_id:
            # Calculate total hours
            start_time_dt = datetime.datetime.strptime(start_time, "%H:%M")
            end_time_dt = datetime.datetime.strptime(end_time, "%H:%M")
            hours = (end_time_dt - start_time_dt).seconds / 3600
            
            # Get field hourly rate
            field = next((f for f in st.session_state.fields if f["id"] == field_id), None)
            if not field:
                return False, "Field not found"
            
            hourly_rate = field["hourly_rate"]
            
            # Calculate service costs
            service_cost = 0
            if services:
                for service_id in services:
                    service = next((s for s in st.session_state.services if s["id"] == service_id), None)
                    if service:
                        service_cost += service["price"]
            
            # Calculate total cost
            total_cost = (hours * hourly_rate) + service_cost
            
            st.session_state.bookings[i] = {
                "id": booking_id,
                "field_id": field_id,
                "customer_id": customer_id,
                "date": date,
                "start_time": start_time,
                "end_time": end_time,
                "hours": hours,
                "services": services if services else [],
                "total_cost": total_cost,
                "status": status,
                "created_at": booking["created_at"],
                "updated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            return True, "Booking updated successfully"
    return False, "Booking not found"

def delete_booking(booking_id):
    """Delete a booking by ID"""
    for i, booking in enumerate(st.session_state.bookings):
        if booking["id"] == booking_id:
            del st.session_state.bookings[i]
            return True, "Booking deleted successfully"
    return False, "Booking not found"

def check_field_availability(field_id, date, start_time, end_time, exclude_booking_id=None):
    """Check if a field is available for booking at the specified time"""
    # Convert strings to datetime for comparison
    date_dt = pd.to_datetime(date).date()
    start_time_dt = datetime.datetime.strptime(start_time, "%H:%M").time()
    end_time_dt = datetime.datetime.strptime(end_time, "%H:%M").time()
    
    for booking in st.session_state.bookings:
        # Skip the booking we're updating (if provided)
        if exclude_booking_id and booking["id"] == exclude_booking_id:
            continue
        
        # Check if booking is for the same field and date
        if booking["field_id"] == field_id and pd.to_datetime(booking["date"]).date() == date_dt:
            booking_start = datetime.datetime.strptime(booking["start_time"], "%H:%M").time()
            booking_end = datetime.datetime.strptime(booking["end_time"], "%H:%M").time()
            
            # Check if there's an overlap
            if (start_time_dt < booking_end and end_time_dt > booking_start):
                return False
    
    return True

# Staff management functions
def add_staff(name, position, phone, email, salary=0):
    """Add a new staff member to the system"""
    staff_id = generate_id()
    st.session_state.staff.append({
        "id": staff_id,
        "name": name,
        "position": position,
        "phone": phone,
        "email": email,
        "salary": salary,
        "hire_date": datetime.datetime.now().strftime("%Y-%m-%d")
    })
    return staff_id

def update_staff(staff_id, name, position, phone, email, salary):
    """Update an existing staff member's information"""
    for i, staff in enumerate(st.session_state.staff):
        if staff["id"] == staff_id:
            st.session_state.staff[i] = {
                "id": staff_id,
                "name": name,
                "position": position,
                "phone": phone,
                "email": email,
                "salary": salary,
                "hire_date": staff["hire_date"]
            }
            return True
    return False

def delete_staff(staff_id):
    """Delete a staff member by ID"""
    for i, staff in enumerate(st.session_state.staff):
        if staff["id"] == staff_id:
            del st.session_state.staff[i]
            return True
    return False

# Customer management functions
def add_customer(name, phone, email, address=""):
    """Add a new customer to the system"""
    customer_id = generate_id()
    st.session_state.customers.append({
        "id": customer_id,
        "name": name,
        "phone": phone,
        "email": email,
        "address": address,
        "registration_date": datetime.datetime.now().strftime("%Y-%m-%d")
    })
    return customer_id

def update_customer(customer_id, name, phone, email, address):
    """Update an existing customer's information"""
    for i, customer in enumerate(st.session_state.customers):
        if customer["id"] == customer_id:
            st.session_state.customers[i] = {
                "id": customer_id,
                "name": name,
                "phone": phone,
                "email": email,
                "address": address,
                "registration_date": customer["registration_date"]
            }
            return True
    return False

def delete_customer(customer_id):
    """Delete a customer by ID"""
    # Check if customer has bookings
    bookings_for_customer = [b for b in st.session_state.bookings if b["customer_id"] == customer_id]
    if bookings_for_customer:
        return False, "Cannot delete customer with existing bookings"
    
    for i, customer in enumerate(st.session_state.customers):
        if customer["id"] == customer_id:
            del st.session_state.customers[i]
            return True, "Customer deleted successfully"
    
    return False, "Customer not found"

# Service management functions
def add_service(name, description, price):
    """Add a new service to the system"""
    service_id = generate_id()
    st.session_state.services.append({
        "id": service_id,
        "name": name,
        "description": description,
        "price": price
    })
    return service_id

def update_service(service_id, name, description, price):
    """Update an existing service's information"""
    for i, service in enumerate(st.session_state.services):
        if service["id"] == service_id:
            st.session_state.services[i] = {
                "id": service_id,
                "name": name,
                "description": description,
                "price": price
            }
            return True
    return False

def delete_service(service_id):
    """Delete a service by ID"""
    # Check if service is used in any bookings
    bookings_with_service = [b for b in st.session_state.bookings if service_id in b.get("services", [])]
    if bookings_with_service:
        return False, "Cannot delete service that is used in bookings"
    
    for i, service in enumerate(st.session_state.services):
        if service["id"] == service_id:
            del st.session_state.services[i]
            return True, "Service deleted successfully"
    
    return False, "Service not found"

# Reporting functions
def get_booking_statistics(start_date=None, end_date=None):
    """Get booking statistics for a date range"""
    if not st.session_state.bookings:
        return {
            "total_bookings": 0,
            "total_revenue": 0,
            "avg_booking_value": 0,
            "daily_stats": []
        }
    
    # Filter bookings by date range if provided
    filtered_bookings = st.session_state.bookings
    if start_date and end_date:
        start_date_dt = pd.to_datetime(start_date).date()
        end_date_dt = pd.to_datetime(end_date).date()
        filtered_bookings = [
            b for b in st.session_state.bookings 
            if start_date_dt <= pd.to_datetime(b["date"]).date() <= end_date_dt
        ]
    
    # Calculate statistics
    total_bookings = len(filtered_bookings)
    total_revenue = sum(b["total_cost"] for b in filtered_bookings)
    avg_booking_value = total_revenue / total_bookings if total_bookings > 0 else 0
    
    # Group by date for daily statistics
    daily_stats = {}
    for booking in filtered_bookings:
        date = pd.to_datetime(booking["date"]).date().strftime("%Y-%m-%d")
        if date not in daily_stats:
            daily_stats[date] = {"bookings": 0, "revenue": 0}
        daily_stats[date]["bookings"] += 1
        daily_stats[date]["revenue"] += booking["total_cost"]
    
    # Convert to list for easier handling in Streamlit
    daily_stats_list = [{"date": k, **v} for k, v in daily_stats.items()]
    
    return {
        "total_bookings": total_bookings,
        "total_revenue": total_revenue,
        "avg_booking_value": avg_booking_value,
        "daily_stats": daily_stats_list
    }

def get_field_utilization():
    """Calculate field utilization statistics"""
    if not st.session_state.fields or not st.session_state.bookings:
        return []
    
    field_stats = {}
    for field in st.session_state.fields:
        field_stats[field["id"]] = {
            "id": field["id"],
            "name": field["name"],
            "total_bookings": 0,
            "total_hours": 0,
            "total_revenue": 0
        }
    
    for booking in st.session_state.bookings:
        field_id = booking["field_id"]
        if field_id in field_stats:
            field_stats[field_id]["total_bookings"] += 1
            field_stats[field_id]["total_hours"] += booking["hours"]
            field_stats[field_id]["total_revenue"] += booking["total_cost"]
    
    return list(field_stats.values())

def get_customer_statistics():
    """Calculate customer statistics"""
    if not st.session_state.customers or not st.session_state.bookings:
        return []
    
    customer_stats = {}
    for customer in st.session_state.customers:
        customer_stats[customer["id"]] = {
            "id": customer["id"],
            "name": customer["name"],
            "total_bookings": 0,
            "total_spending": 0
        }
    
    for booking in st.session_state.bookings:
        customer_id = booking["customer_id"]
        if customer_id in customer_stats:
            customer_stats[customer_id]["total_bookings"] += 1
            customer_stats[customer_id]["total_spending"] += booking["total_cost"]
    
    return list(customer_stats.values())

