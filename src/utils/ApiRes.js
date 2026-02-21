class ApiRes {
// ApiRes ek custom response class hai
// Ye successful API responses ko standard format me bhejne ke liye use hoti hai

    constructor(statusCode, data, message = "Success") {
        // Constructor tab call hota hai jab new ApiRes() banate hain

        this.statusCode = statusCode
        // HTTP status code store karta hai (200, 201, etc)

        this.data = data
        // Actual response data store karta hai (user info, product list etc)

        this.message = message
        // Custom success message (default = "Success")

        this.success = statusCode < 400
        // Agar status code 400 se kam hai → success true
        // Agar 400 ya usse upar hai → success false
    }
}

export { ApiRes }
// Is class ko export kar rahe hain taaki controllers me use kar sake