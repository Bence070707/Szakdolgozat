using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Key> Keys { get; set; }
    public DbSet<Heel> Heels { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Key>(entity =>
        {
            entity.ToTable(t =>
            {
                t.HasCheckConstraint(
                    "CK_Key_PriceType",
                    "PriceType IN (1, 2, 3)"
                );
                t.HasCheckConstraint(
                    "CK_Key_Quantity",
                    "Quantity > 0"
                );
            });
        });
    }
}
