module.exports = {
    lookFor: function (managers, managerDetails, val) {
        for (let name in managerDetails.data) {
            if(((managerDetails.data[name].attributes.name).toLowerCase()).includes(val.toLowerCase())) {
                managers.push(managerDetails.data[name].attributes.name);
            }
        }
        for (let nameOrEmail in managerDetails.included) {
            if (managerDetails.included[nameOrEmail].attributes.hasOwnProperty('name')) {
                if(((managerDetails.included[nameOrEmail].attributes.name).toLowerCase()).includes(val.toLowerCase())) {
                    if (!managers.includes(managerDetails.included[nameOrEmail].attributes.name)) {
                        managers.push(managerDetails.included[nameOrEmail].attributes.name);
                    }
                }
            }
            else if (managerDetails.included[nameOrEmail].attributes.hasOwnProperty('email')) {
                if(((managerDetails.included[nameOrEmail].attributes.email).toLowerCase()).includes(val.toLowerCase())) {
                    managers.push(managerDetails.included[nameOrEmail].attributes.email);
                }
            }
        }
    },
};