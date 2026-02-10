using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Key> Keys { get; set; }
    public DbSet<Heel> Heels { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<SaleItem> SaleItems { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }

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
                    "Quantity >= 0"
                );
            });
        });

        modelBuilder.Entity<Sale>()
        .HasMany(s => s.Items)
        .WithOne(si => si.Sale)
        .HasForeignKey(si => si.SaleId);

        modelBuilder.Entity<PurchaseOrder>()
        .HasMany(o => o.Items)
        .WithOne(o=>o.PurchaseOrder)
        .HasForeignKey(o => o.PurchaseOrderId)
        .OnDelete(DeleteBehavior.Cascade);
    }

    public override Task<int> SaveChangesAsync(
    bool acceptAllChangesOnSuccess,
    CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<PurchaseOrder>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }

            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }
}
