import dotenv from "dotenv";
import { Gitlab, ProjectSchema, UserSchema } from "gitlab";
import { AccessLevel } from "gitlab/dist/types/core/templates";

dotenv.config();
const gitlab = new Gitlab({
    host: process.env.HOST,
    token: process.env.API_TOKEN,
});


export class GitlabAccessManager {

    public async addSupervisorsToGroups(groupIds: number[], supervisors: string[]) {
        for (let groupId of groupIds) {
            await this.addSupervisorsToGroup(groupId, supervisors);
        }
    }

    public async addSupervisorsToGroup(groupId: number, supervisors: string[]) {
        console.log(`Starting to add supervisors to group ${groupId}`);
        let projects = await gitlab.GroupProjects.all(groupId);
        for (let project of projects) {
            await this.addSupervisorsToProject(project, supervisors);
        }
    }

    private async addSupervisorsToProject(project: ProjectSchema, supervisors: string[]) {
        for (let supervisor of supervisors) {
            let user = await this.searchForUser(supervisor);
            if (user) {
                try {
                    await gitlab.ProjectMembers.add(project.id, user.id, 40);
                    console.log(`Added User ${supervisor} to project`);
                } catch (error) {
                    console.log(`Warning: Could not add user ${supervisor} to project ${project.web_url}`);
                    console.log(error);
                }
            } else {
                console.log(`Warning: Could not find user ${supervisor} by name`);
            }
        }
    }

    private async searchForUser(userName: string): Promise<UserSchema | null> {
        let users: UserSchema[] = await gitlab.Users.search(userName) as UserSchema[];
        if (users.length == 0) {
            return null;
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i].username === userName) {
                return users[i];
            }
        }
        return null;
    }

    public async manageLearnerAccessForGroups(groupIds: number[], authorizeLearners: boolean, supervisors: string[]) {
        for (let groupId of groupIds) {
            await this.manageLearnerAccessForGroup(groupId, authorizeLearners, supervisors);
        }
    }

    public async manageLearnerAccessForGroup(groupId: number, authorizeLearners: boolean, supervisors: string[]) {
        console.log(`Starting to manage learner access on group ${groupId}`);
        let projects = await gitlab.GroupProjects.all(groupId);
        for (let project of projects) {
            await this.manageLearnerAccessForProject(project, authorizeLearners, supervisors);
        }
    }

    private async manageLearnerAccessForProject(project: ProjectSchema, authorizeLearners: boolean, supervisors: string[]) {
        try { 
            let users: UserSchema[] = await gitlab.ProjectMembers.all(project.id) as UserSchema[];
            for (let user of users) {
                if (!supervisors.includes(user.username)) {
                    await gitlab.ProjectMembers.edit(project.id, user.id, this.getAccessLevel(authorizeLearners));
                }
            }
            console.log("Changed access on project");
        } catch (error) {
            console.log("An error occurred while changing access on project " + project.web_url);
            console.log(error);
            return;
        }  
    }

    private getAccessLevel(authorizeLearners: boolean): AccessLevel {
        return authorizeLearners ? 40 : 10;
    }
}