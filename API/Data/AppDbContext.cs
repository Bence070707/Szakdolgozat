using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Key> Keys { get; set; }
    public DbSet<KeyImage> KeyImages { get; set; }
    public DbSet<Heel> Heels { get; set; }
    public DbSet<HeelImage> HeelImages { get; set; }
    public DbSet<Other> Others { get; set; }
    public DbSet<OtherImage> OtherImages { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<SaleItem> SaleItems { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
    public DbSet<StockMovement> StockMovements { get; set; }

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

        modelBuilder.Entity<KeyImage>(entity =>
        {
            entity.HasOne(ki => ki.Key)
                .WithMany(k => k.Images)
                .HasForeignKey(ki => ki.KeyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<HeelImage>(entity =>
        {
            entity.HasOne(hi => hi.Heel)
                .WithMany(h => h.Images)
                .HasForeignKey(hi => hi.HeelId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OtherImage>(entity =>
        {
            entity.HasOne(oi => oi.Other)
                .WithMany(o => o.Images)
                .HasForeignKey(oi => oi.OtherId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Sale>()
        .HasOne(s => s.User)
        .WithMany()
        .HasForeignKey(s => s.UserId)
        .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Sale>()
        .HasMany(s => s.Items)
        .WithOne(si => si.Sale)
        .HasForeignKey(si => si.SaleId);

        modelBuilder.Entity<PurchaseOrder>()
        .HasMany(o => o.Items)
        .WithOne(o => o.PurchaseOrder)
        .HasForeignKey(o => o.PurchaseOrderId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<IdentityRole>()
        .HasData(
            new IdentityRole
            {
                Id = "manager-id",
                Name = "Manager",
                NormalizedName = "MANAGER",
                ConcurrencyStamp = "manager-stamp"
            },
            new IdentityRole
            {
                Id = "admin-id",
                Name = "Admin",
                NormalizedName = "ADMIN",
                ConcurrencyStamp = "admin-stamp"
            }
        );

        modelBuilder.Entity<StockMovement>(entity =>
        {
            entity.HasOne(sm => sm.User)
                .WithMany()
                .HasForeignKey(sm => sm.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

        });
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
