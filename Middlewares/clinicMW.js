const {body , param} = require("express-validator")

exports.clinicValidation=[
    body("clinic_location").optional().isObject().notEmpty().withMessage("location for this clinic is required"),
    body("clinicName").optional().isString().withMessage("clinic name should be characters only "),

]

exports.serviceValidation=[ 
    body("name").isString().optional().withMessage("service name in this clinic"),
    body("salary").isInt().default(0).withMessage("service salary in this clinic").optional(),
    body("doctor_id").isInt().optional().withMessage("doctor id for this service in this clinic"),
    body("clinic_id").isInt().optional().withMessage("clinic id for this service in this service")
]

module.exports.sortService = (data,query)=>{
    let sortBy = query.sortBy||'salary';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1

    if (sortBy=='doctorName' || sortBy == 'doctorname'){
        data.sort((a, b) => {
            if (a.doctor_id.userData.fullName < b.doctor_id.userData.fullName) {
                return -1*orderValue;
            }
            if (a.doctor_id.userData.fullName > b.doctor_id.userData.fullName) {
                return 1*orderValue;
            }
            return 0;
        });
    }
    else if (sortBy=='clinicName' || sortBy == 'clinicname'){
        data.sort((a, b) => {
            if (a.clinic_id.clinicName < b.clinic_id.clinicName) {
                return -1*orderValue;
            }
            if (a.clinic_id.clinicName > b.clinic_id.clinicName) {
                return 1*orderValue;
            }
            return 0;
        });
    }
    else{
        return data.sort((a,b)=>{
            if(a[sortBy]<b[sortBy]) return -1*orderValue;
            if(a[sortBy]>b[sortBy]) return 1*orderValue;
        });
    }
};













