# divekit-access-manager

if supervisorMode is activated in the accessConfig:
- all configured supervisors will be added as maintainers to the specified groups

if supervisorMode is deactivated in the accessConfig:
- all already existing learners on projects inside groups will be promoted to maintainer when authorizeLearners is true 
- otherwise learner rights will be revoked to quest status
- configured supervisors will be ignored in this procedure