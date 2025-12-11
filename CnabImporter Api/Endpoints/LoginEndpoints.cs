namespace Api.Endpoints;

public static class LoginEndpoints
{
    public static void MapLoginEndpoints(this WebApplication app)
    {
        var tag = new List<OpenApiTag> { new() { Name = "Login" } };

        app.MapPost("/api/login",
        async (
            Login model,
            [FromServices] ILoginService service,
            [FromServices] INotificationService notification) =>
        {
            var authenticatedUser = await service.LoginAsync(model);
            if (notification.HasNotifications) return Results.BadRequest(notification.Notifications);
            if (authenticatedUser is null) return Results.NoContent();
            return Results.Ok(authenticatedUser);
        })
        .Produces((int)HttpStatusCode.OK)
        .WithName($"Login")
        .WithOpenApi(x => new OpenApiOperation(x)
        {
            Summary = "Login to get token",
            Description = "This endpoint validates the user email and password to login. It produces a 200 status code.",
            Tags = tag
        });

        app.MapPost("/api/sigin",
        async (
            Login model,
            [FromServices] ILoginService service,
            [FromServices] INotificationService notification) =>
        {
            var authenticatedUser = await service.SiginAsync(model);
            if (notification.HasNotifications) return Results.BadRequest(notification.Notifications);
            if (authenticatedUser is null) return Results.NoContent();
            return Results.Ok(authenticatedUser);
        })
        .Produces((int)HttpStatusCode.OK)
        .WithName($"Sigin")
        .WithOpenApi(x => new OpenApiOperation(x)
        {
            Summary = "Sigin to get token",
            Description = "This endpoint creates a new user, then validate the email and password to login. It produces a 200 status code.",
            Tags = tag
        });

        app.MapPost("/api/login/activate/{activationCode:Guid}",
        async (
            Guid activationCode,
            [FromServices] ILoginService service,
            [FromServices] INotificationService notification) =>
        {
            var authenticatedUser = await service.ActivateUserAsync(activationCode);
            if (notification.HasNotifications) return Results.BadRequest(notification.Notifications);
            if (authenticatedUser is null) return Results.NoContent();
            return Results.Ok(authenticatedUser);
        })
        .Produces((int)HttpStatusCode.OK)
        .WithName("Activate")
        .WithOpenApi(x => new OpenApiOperation(x)
        {
            Summary = "Activate login by code",
            Description = "This endpoint activate user with activation code send by e-mail. It produces a 200 status code.",
            Tags = tag
        });

        app.MapPost("/api/login/forgot-password/{email}",
        async (
            string email,
            [FromServices] ILoginService service,
            [FromServices] INotificationService notification) =>
        {
            await service.ForgotPasswordAsync(email);
            if (notification.HasNotifications) return Results.BadRequest(notification.Notifications);
            return Results.Ok();
        })
        .Produces((int)HttpStatusCode.OK)
        .WithName("ForgotPassword")
        .WithOpenApi(x => new OpenApiOperation(x)
        {
            Summary = "Forgot recovery password",
            Description = "This endpoint records an email to be sent to the user to recover their password. It produces a 200 status code.",
            Tags = tag
        });

        app.MapPost("/api/login/check-reset-password-code/{resetPasswordCode:Guid}",
        async (
            Guid resetPasswordCode,
            [FromServices] ILoginService service) => Results.Ok(await service.CheckResetPasswordCodeAsync(resetPasswordCode)))
        .Produces((int)HttpStatusCode.OK)
        .WithName("CheckResetPasswordCode")
        .WithOpenApi(x => new OpenApiOperation(x)
        {
            Summary = "Check the code to reset password",
            Description = "This endpoint check the code to reset password. It produces a 200 status code.",
            Tags = tag
        });

        app.MapPost("/api/login/reset-password",
        async (
            ResetPassword model,
            [FromServices] ILoginService service,
            [FromServices] INotificationService notification) =>
        {
            await service.ResetPasswordAsync(model);
            if (notification.HasNotifications) return Results.BadRequest(notification.Notifications);
            return Results.Ok();
        })
        .Produces((int)HttpStatusCode.OK)
        .WithName("ResetPassword")
        .WithOpenApi(x => new OpenApiOperation(x)
        {
            Summary = "Reset password by code",
            Description = "This endpoint reset password with code send by e-mail. It produces a 200 status code.",
            Tags = tag
        });
    }
}