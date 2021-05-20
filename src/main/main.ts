import { GitlabAccessManager } from "./GitlabAccessManager";

import * as accessConfig from '../config/accessConfig.json';


let gitlabAccessManager: GitlabAccessManager = new GitlabAccessManager();
if (accessConfig.supervisorMode) {
    gitlabAccessManager.addSupervisorsToGroups(accessConfig.groupIds, accessConfig.supervisors);
} else {
    gitlabAccessManager.manageLearnerAccessForGroups(accessConfig.groupIds, accessConfig.authorizeLearners, accessConfig.supervisors);
}

