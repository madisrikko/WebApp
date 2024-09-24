﻿using Microsoft.AspNetCore.Identity;

namespace ReactApp1.Server.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string? ProfilePictureUrl { get; set; }
    }
}
