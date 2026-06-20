import styles from './AssignmentForm.module.css'

import {type MouseEvent, useEffect, useState} from 'react'

const AssignmentForm = () => {
    const [projects, setProjects] = useState([]);

    const [fName, setFName] = useState("");
    const [email, setEmail] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [techStack, setTechStack] = useState("");
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [projDuration, setProjDuration] = useState("");
    const [addSkills, setAddSkills] = useState("");
    const [confAvailability, setConfAvailability] = useState(false);


    useEffect(() => {
        async function fetchData(){
            try {
                const res = await fetch(
                    'http://localhost:5000/',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const data = await res.json();
                setProjects(data);
            } catch(error) {
                console.log(
                    "Failed to fetch projects table!",
                    error
                );
            }

        }
        void fetchData();
    }, []);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formValues = {
            fName,
            email,
            experienceLevel,
            techStack,
            selectedProjects,
            projDuration,
            addSkills,
            confAvailability
        }
        fetch('http://localhost:5000/assignment', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formValues)
        }).then(res => res.formData())
        console.log(formValues);
    }

    const handleProjectsChange = (
        e: MouseEvent<HTMLOptionElement>,
        value: string
    ) => {
        e.preventDefault();

        setSelectedProjects((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
        );
    }

    return (
        <div className={styles.assignmentForm}>
            <form onSubmit={handleSubmit}>
                <h1 className={styles.header}>Project Assignment Form</h1>
                <p>Complete your profile to get assigned to internal projects.</p>
                <br/>
                <div className={styles.inline}>Full Name:</div>
                <input
                    type="text"
                    required
                    value={fName}
                    name="fName"
                    onChange={(e) => setFName(e.target.value)}
                />
                <br/><br/>
                <div className={styles.inline}>Email Address:</div>
                <input
                    type="text"
                    required
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br/><br/>
                <div className={styles.inline}>Experience Level:</div>
                <select
                    name="experienceLevel"
                    required
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                >
                    <option value="">Select your level</option>
                    <option value="junior">Junior (0-2 years)</option>
                    <option value="mid">Mid-level (2-5 years)</option>
                    <option value="senior">Senior (5+ years)</option>
                </select>
                <br/><br/>
                <div className={styles.inline}>Primary Technology Stack:</div>
                <select
                    name="techStack"
                    required
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                >
                    <option value="">Choose one</option>
                    <option value="backend">Backend Development</option>
                    <option value="frontend">Frontend Development</option>
                    <option value="fullstack">Full-Stack Development</option>
                    <option value="data">Data Engineering</option>
                    <option value="devops">DevOps</option>
                    <option value="mobile">Mobile Development</option>
                </select>
                <br/><br/>
                <div className="multi-select">
                    <div className={styles.inline}>Available Projects:</div>
                    <br/>
                    <select
                        name="selectedProjects"
                        className={styles.multiselect}
                        required
                        multiple
                        size={8}
                        value={selectedProjects}
                    >
                        {projects.map((project) => (
                            <option
                                value={project}
                                onDoubleClick={(e) => handleProjectsChange(e, project)}
                            >
                                {project}
                            </option>
                        ))}
                    </select>
                </div>
                <br/><br/>
                <div className={styles.inline}>Preferred project duration:</div>
                <div className={styles.radio}>
                    <input
                        type="radio"
                        value="short"
                        name="projDuration"
                        onChange={(e) => setProjDuration(e.target.value)}
                    /> Short-term (1-3 months)
                </div>
                <div className={styles.radio}>
                    <input
                        type="radio"
                        value="medium"
                        name="projDuration"
                        onChange={(e) => setProjDuration(e.target.value)}
                    /> Medium-term (3-6 months)
                </div>
                <div className={styles.radio}>
                    <input
                        type="radio"
                        value="long"
                        name="projDuration"
                        onChange={(e) => setProjDuration(e.target.value)}
                    /> Long-term (6+ months)
                </div>
                <br/><br/>
                <div className={styles.inline}>Additional Skills (optional):</div>
                <span className={styles.resizableInput}>
                    <input
                        type="text"
                        placeholder="e.g., Python, Docker, React"
                        name="addSkills"
                        value={addSkills}
                        onChange={(e) => setAddSkills(e.target.value)}
                    />
                </span>
                <br/><br/>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    name="confAvailability"
                    onChange={(e) => setConfAvailability(e.target.checked)}
                />
                <div className={styles.inline}>I confirm my availability for the selected projects:</div>
                <br/><br/>
                <input
                    className={styles.saveForm}
                    type="submit"
                    value="Save Profile"
                    disabled={!confAvailability}
                />
                <input
                    className={styles.clearForm}
                    type="reset"
                    value="Clear Form"
                />
            </form>
        </div>
    )
}
export default AssignmentForm
