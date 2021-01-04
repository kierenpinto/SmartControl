
class User {
    /**
     * 
     * @param id ID (Primary Key Field or Document ID)
     * @param firstname User's firstname
     * @param lastname User's last name
     * @param home home's Document ID, household name
     */
    constructor(public id:string, public firstname:string, public lastname:string, public home:Map<string,string> ){}
}
export {User}