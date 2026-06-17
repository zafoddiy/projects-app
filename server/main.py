import sqlite3
import re
from flask import Flask, session, request, jsonify

app = Flask(__name__)
app.secret_key = "&&#1/vgfd2sHBX{x43jlpqw74@"


"""
name: get_projects
description: Function to copy all projects from db to var
"""
def get_projects():
    db = db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT project_name from projects")
    project_list = cursor.fetchall()
    cursor.close()
    project_list = [str(val[0]) for val in project_list]
    return project_list

"""
name: db_connections
description: Connect to db. If unsuccessful, print error.
"""
def db_connection():
    connection = None
    try:
        connection = sqlite3.connect('assignment.db')
    except sqlite3.error as e:
        print(e)
    return connection

"""
name: insert_projects
description: Assigns projects to employee ID and inserts into employee and composite db tables.
"""
def insert_projects(db, projects, email, check):
    # cursors for each table
    projects_cursor = db.cursor()
    employee_cursor = db.cursor()
    composite_cursor = db.cursor()

    # fetch project ids from db
    project_ids = []
    for project in projects:
        projects_cursor.execute("""SELECT id FROM projects WHERE project_name = ?""", (project,))
        project_ids.append(projects_cursor.fetchone())
    projects_cursor.close()
    project_ids = [int(val[0]) for val in project_ids]


    employee_cursor.execute("""SELECT id FROM employees WHERE email = ?""", (email,))
    employees = employee_cursor.fetchall()
    employee_cursor.close()
    employee_id = employees[0][0]

    # delete project assignments to employee if update was called, then insert assignments into composite table in db
    if check:
        composite_cursor.execute("""DELETE FROM employees_projects WHERE employee_id = ?""", (employee_id,))
    for project_id in project_ids:
        composite_cursor.execute("""INSERT INTO employees_projects (employee_id, project_id) VALUES (?, ?);""", (employee_id, project_id))
    composite_cursor.close()

"""
name: is_email_valid
Description: Checks if email has a valid format.
"""
def is_email_valid(email):
    regex = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}"
    return re.match(regex, email)

"""
name: index
Description: index API
"""
@app.route("/", methods=["POST", "GET"])
def index():
    session["projects"] = get_projects()
    return jsonify(session["projects"])

"""
name: assignment
description: assignment API, POST method to receive all of the fields.
"""
@app.route("/assignment", methods=["POST"])
def assignment():
    # API requests for each field with given variable for frontend
    fName = request.form["fName"]
    email = request.form["email"]
    exp_level = request.form["experience_level"]
    tech_stack = request.form["tech_stack"]
    selected_projects = request.form.getlist("projects")
    proj_duration = request.form["proj_duration"]
    addt_skills = request.form["add_skills"]
    availability = request.form["conf_availability"]

    # check if the fields are all valid and filled out
    if len(fName) == 0 or not is_email_valid(email) or exp_level == "" or tech_stack == "" \
        or not selected_projects or proj_duration is None or availability is None:
        return jsonify(session["projects"]), 400

    # insert from API into employee table in db
    db = db_connection()
    employee_cursor = db.cursor()
    employee_cursor.execute("""SELECT * FROM employees WHERE name = ? AND email = ?""", (fName, email,))
    update_check = False
    employee_data_update = (fName, exp_level, tech_stack, proj_duration, addt_skills, email)
    employee_data_insert = (fName, email, exp_level, tech_stack, proj_duration, addt_skills)

    # update if email already exists in db, else insert into db
    if employee_cursor.rowcount:
        employee_cursor.execute("""UPDATE employees SET name = ?, experience_level = ?,
                                tech_stack = ?, project_duration = ?, additional_skills = ? WHERE email = ?""", (employee_data_update))
        update_check = True
    else:
        employee_cursor.execute("""INSERT INTO employees (name, email, experience_level, tech_stack, project_duration, additional_skills) 
                                    VALUES (?, ?, ?, ?, ?, ?);""", employee_data_insert)
    employee_cursor.close()
    insert_projects(db, selected_projects, email, update_check)
    db.commit()
    return jsonify(session["projects"]), 201

if __name__ == '__main__':
    app.run()