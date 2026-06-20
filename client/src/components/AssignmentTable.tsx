import styles from './AssignmentTable.module.css'

import {useEffect, useState} from 'react'

type APIResponse = [
    UserRaw[],
    ProjectRaw[],
    AssignmentRaw[],
];

type UserRaw = [
    number,
    string,
    string,
    string,
    string,
    string,
    string
];

type ProjectRaw = [
    number,
    string
];

type AssignmentRaw = [
    number,
    number
];

interface User {
    id: number;
    name: string;
    email: string;
    level: string;
    stack: string;
    duration: string;
    skills: string;
    projects: string[];
}

interface Project {
    id: number;
    name: string;
    employees: string[];
}

const AssignmentTable = () => {

    const [employees, setEmployees] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(
                    'http://localhost:5000/table',
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data:APIResponse = await res.json();

                const [
                    employees,
                    projects,
                    assignments
                ] = data;

                const employeeMap = new Map<number, string>(
                    employees.map(([id, name]) => [
                        id,
                        name
                    ])
                );

                const projectMap = new Map<number, string>(
                    projects.map(([id, name]) => [
                        id,
                        name,
                    ])
                );

                const employeesProjects = new Map<number, string[]>();

                assignments.forEach(
                    ([userID, projectID]) => {
                        const projectName =
                            projectMap.get(projectID);

                        if(!projectName) return;

                        const existing =
                            employeesProjects.get(userID) ?? [];

                        employeesProjects.set(userID, [
                            ...existing,
                            projectName
                        ]);
                    }
                );

                const formattedUsers: User[] =
                    employees.map(
                        ([
                             id,
                             name,
                             email,
                             level,
                             stack,
                             duration,
                             skills,
                         ]) => ({
                            id,
                            name,
                            email,
                            level,
                            stack,
                            duration,
                            skills,
                            projects:
                                employeesProjects.get(id) ?? [],
                        })
                    );

                const projectEmployees =
                    new Map<number, string[]>();

                assignments.forEach(
                    ([userID, projectID]) => {
                        const employeeName =
                            employeeMap.get(userID);

                        if(!employeeName) return;

                        const current =
                            projectEmployees.get(projectID) ?? [];

                        projectEmployees.set(projectID, [
                            ...current,
                            employeeName
                        ]);
                    }
                );

                const formattedProjects: Project[] =
                    projects.map(
                        ([id, name]) => ({
                            id,
                            name,
                            employees:
                                projectEmployees.get(id) ?? [],
                        })
                    );

                setEmployees(formattedUsers);
                setProjects(formattedProjects);
            } catch (error) {
                console.error(
                    "Failed to fetch data tables!",
                    error
                );
            }
        }

        void fetchData();
    }, []);

    return (
        <div className={styles.assignmenttable}>
        <h2>Employees Table</h2>
        <table className="table table-striped">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Level</th>
                <th>Stack</th>
                <th>Duration</th>
                <th>Skills</th>
                <th>Projects</th>
            </tr>
            </thead>

            <tbody>
            {employees.map((employee) => (
                <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.level}</td>
                    <td>{employee.stack}</td>
                    <td>{employee.duration}</td>
                    <td>{employee.skills}</td>
                    <td>{employee.projects.join(", ")}</td>
                </tr>
            ))}
            </tbody>
        </table>
            <h2>Projects</h2>

            <table className="table table-group-divider">
                <thead>
                <tr>
                    <th>Project ID</th>
                    <th>Project Name</th>
                    <th>Assigned Employees</th>
                </tr>
                </thead>

                <tbody>
                {projects.map((project) => (
                    <tr key={project.id}>
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                        <td>
                            {project.employees.join(", ")}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
export default AssignmentTable
