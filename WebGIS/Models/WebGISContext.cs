using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebGIS.ProviderClass;

namespace WebGIS.Models
{
    public partial class WebGISContext : DbContext
    {
        public WebGISContext()
        {
        }

        public WebGISContext(DbContextOptions<WebGISContext> options)
            : base(options)
        {
        }

        public virtual DbSet<MapService_Config> MapService_Config { get; set; }
        public virtual DbSet<MapService_MapIgnoreClickQueryConfig> MapService_MapIgnoreClickQueryConfig { get; set; }
        public virtual DbSet<MapService_PressureAnalysisConfig> MapService_PressureAnalysisConfig { get; set; }
        public virtual DbSet<MapService_QueryFieldConfig> MapService_QueryFieldConfig { get; set; }
        public virtual DbSet<MapService_QueryLayerConfig> MapService_QueryLayerConfig { get; set; }
        public virtual DbSet<Platform_UserInfo> Platform_UserInfo { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite(HostEnvironmentProvider.ConnectionStringForSQLite);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MapService_Config>(entity =>
            {
                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.format).HasColumnType("VARCHAR(10)");

                entity.Property(e => e.isIgnoreFullExtent).HasColumnType("VARCHAR(10)");

                entity.Property(e => e.layerIdentifier).HasColumnType("VARCHAR(10)");

                entity.Property(e => e.layername).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.servername).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.serviceMode).HasColumnType("VARCHAR(10)");

                entity.Property(e => e.showseq).HasDefaultValueSql("0");

                entity.Property(e => e.style).HasColumnType("VARCHAR(10)");

                entity.Property(e => e.tileMatrixSetIdentifier).HasColumnType("VARCHAR(10)");

                entity.Property(e => e.type).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.visible).HasColumnType("VARCHAR(10)");
            });

            modelBuilder.Entity<MapService_MapIgnoreClickQueryConfig>(entity =>
            {
                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.showseq).HasDefaultValueSql("0");
            });

            modelBuilder.Entity<MapService_PressureAnalysisConfig>(entity =>
            {
                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.firstColumnName).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.isSingle).HasColumnType("VARCHAR(10)");

                entity.Property(e => e.mainField).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.name).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.realAreaFieldName).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.serverType).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.showseq).HasDefaultValueSql("0");
            });

            modelBuilder.Entity<MapService_QueryFieldConfig>(entity =>
            {
                entity.Property(e => e.ID).ValueGeneratedNever();
            });

            modelBuilder.Entity<MapService_QueryLayerConfig>(entity =>
            {
                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.chineseName).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.jumpIdFieldName).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.jumpTitleFieldName).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.jumpUrl).HasColumnType("VARCHAR(50)");

                entity.Property(e => e.showseq).HasDefaultValueSql("0");
            });

            modelBuilder.Entity<Platform_UserInfo>(entity =>
            {
                entity.Property(e => e.ID).ValueGeneratedNever();

                entity.Property(e => e.IsAdministrator).HasColumnType("VARCHAR(10)");

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasColumnType("VARCHAR(30)");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
