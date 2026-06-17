import sqlite3

projects = [
    "Customer Portal Redesign",
    "Data Pipeline Migration",
    "Mobile App Enhancement",
    "Internal Analytics Dashboard",
    "API Gateway Implementation",
    "Cloud Infrastructure Setup",
    "E-commerce Platform Update",
    "Reporting System Automation",
    "Microservices Architecture Transition",
    "Customer Data Platform Integration"
]

sql_connection = sqlite3.connect("assignment.db")
sql_cursor = sql_connection.cursor()

sql_cursor.execute("CREATE TABLE projects (id INTEGER PRIMARY KEY, project_name TEXT)")
for i in range(len(projects)):
    sql_cursor.execute("INSERT into projects (project_name) values (?)", [projects[i]])
    print("debug ADD ", projects[i])
sql_cursor.execute("CREATE TABLE employees (id INTEGER PRIMARY KEY," \
                                            "name TEXT NOT NULL," \
                                            "email TEXT UNIQUE," \
                                            "experience_level TEXT," \
                                            "tech_stack TEXT," \
                                            "project_duration TEXT," \
                                            "additional_skills TEXT)")
sql_cursor.execute("CREATE TABLE employees_projects (employee_id INTEGER," \
                                                    "project_id INTEGER," \
                                                    "PRIMARY KEY (employee_id, project_id)," \
                                                    "FOREIGN KEY (employee_id) REFERENCES employees(id)," \
                                                    "FOREIGN KEY (project_id) REFERENCES projects(id))")

sql_connection.commit()
sql_connection.close()