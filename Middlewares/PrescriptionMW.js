const {body , param} = require("express-validator")


exports.prescriptionValidation=[ 
    body("diagnosis").isString().notEmpty().withMessage("diagnosis is required"),
    body("currentExamination").isString().withMessage("appointment date is required"),
    body("nextExamination").isString().withMessage(" next consiled date is required"),
    body("doctor_id").isInt().notEmpty().withMessage("doctor id is requied").optional(),
    body("patient_id").isInt().notEmpty().withMessage("clinic id is requied"),
    body("medicine_id").toArray().notEmpty().withMessage("medicine list is requied")
]

module.exports.sortPrescription = (data,query)=>{
    let sortBy = query.sortBy||'diagnosis';
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
    else if (sortBy=='patientName' || sortBy == 'patientname'){
        data.sort((a, b) => {
            if (a.patient_id.patientData.fullName < b.patient_id.patientData.fullName) {
                return -1*orderValue;
            }
            if (a.patient_id.patientData.fullName > b.patient_id.patientData.fullName) {
                return 1*orderValue;
            }
            return 0;
        });
    }
    else if (sortBy=='medicineName' || sortBy == 'medicinename'){
        data.sort((a, b) => {
            if (a.medicine_id.medicineName < b.medicine_id.medicineName) {
                return -1*orderValue;
            }
            if (a.medicine_id.medicineName > b.medicine_id.medicineName) {
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
module.exports.getQueryToFindWith =(request)=> {
    const query = {};
    if (request.query.diagnosis)
        query.diagnosis = request.query.diagnosis;
    if (request.query.currentExamination)
        query.currentExamination = request.query.currentExamination;
    if (request.query.doctor_id)
        query.doctor_id = request.query.doctor_id;
    if (request.query.patient_id)
        query.patient_id = request.query.patient_id;
    return query;
}
