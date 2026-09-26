# Manual skill evaluations

These scenarios test decision quality that repository checks cannot prove. They are not automated tests and are not claims that a scenario has run.

1. Use a clean, isolated scratch workspace with synthetic data only.
2. Give the evaluator the target `SKILL.md`, the task input, and the smallest fixture needed to act. Do not give it the success criteria or failure signals before it responds.
3. Preserve the actual response, artifacts, commands, environment, and skill revision.
4. Compare the result to the rubric after the run. Record omissions and unsupported claims as well as successes.
5. Change instructions only when an observed result justifies the change. Re-run the affected scenario after a material revision.

The scenarios in this directory do not create authorization to contact external services, access real user data, or deploy changes.
