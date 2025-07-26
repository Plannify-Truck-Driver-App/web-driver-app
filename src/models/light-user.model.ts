export class LightUser {
    userId: string;
    firstname: string;
    lastname: string;
    gender: string | null;
    email: string;

    public constructor(userId: string, firstname: string, lastname: string, gender: string | null, email: string) {
        this.userId = userId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.gender = gender;
        this.email = email;
    }

    public static fromJSON(json: any): LightUser {
        return new LightUser(
            json['user_id'],
            json['firstname'],
            json['lastname'],
            json['gender'],
            json['email']
        );
    }
}