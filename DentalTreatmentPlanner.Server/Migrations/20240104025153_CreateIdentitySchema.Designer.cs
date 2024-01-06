﻿// <auto-generated />
using System;
using DentalTreatmentPlanner.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240104025153_CreateIdentitySchema")]
    partial class CreateIdentitySchema
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.AlternativeProcedure", b =>
                {
                    b.Property<int>("AlternativeProcedureId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("alternative_procedure_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AlternativeProcedureId"));

                    b.Property<int>("CdtCodeId")
                        .HasColumnType("int")
                        .HasColumnName("cdt_code_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("description");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("type");

                    b.HasKey("AlternativeProcedureId");

                    b.HasIndex("CdtCodeId");

                    b.ToTable("alternative_procedure", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.CdtCode", b =>
                {
                    b.Property<int>("CdtCodeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("cdt_code_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CdtCodeId"));

                    b.Property<int>("CdtCodeCategoryId")
                        .HasColumnType("int")
                        .HasColumnName("cdt_code_category_id");

                    b.Property<int>("CdtCodeSubcategoryId")
                        .HasColumnType("int")
                        .HasColumnName("cdt_code_subcategory_id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("cdt_code");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<int>("FacilityId")
                        .HasColumnType("int")
                        .HasColumnName("facility_id");

                    b.Property<string>("LongDescription")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("long_description");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<string>("ShortDescription")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("short_description");

                    b.HasKey("CdtCodeId");

                    b.HasIndex("CdtCodeCategoryId");

                    b.HasIndex("CdtCodeSubcategoryId");

                    b.HasIndex("FacilityId");

                    b.ToTable("cdt_code", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.CdtCodeCategory", b =>
                {
                    b.Property<int>("CdtCodeCategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("cdt_code_category_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CdtCodeCategoryId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.HasKey("CdtCodeCategoryId");

                    b.ToTable("cdt_code_category", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.CdtCodeSubcategory", b =>
                {
                    b.Property<int>("CdtCodeSubcategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("cdt_code_subcategory_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CdtCodeSubcategoryId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.HasKey("CdtCodeSubcategoryId");

                    b.ToTable("cdt_code_subcategory", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.Facility", b =>
                {
                    b.Property<int>("FacilityId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("facility_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("FacilityId"));

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("city");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.Property<string>("Street")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("street");

                    b.Property<string>("Suite")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("suite");

                    b.Property<string>("ZipCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("zip_code");

                    b.HasKey("FacilityId");

                    b.ToTable("facility", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.FacilityProviderMap", b =>
                {
                    b.Property<int>("FacilityProviderMapId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("facility_provider_map_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("FacilityProviderMapId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<int>("FacilityId")
                        .HasColumnType("int")
                        .HasColumnName("facility_id");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<int>("ProviderId")
                        .HasColumnType("int")
                        .HasColumnName("provider_id");

                    b.HasKey("FacilityProviderMapId");

                    b.HasIndex("FacilityId");

                    b.HasIndex("ProviderId");

                    b.ToTable("facility_provider_map", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.ProcedureCategory", b =>
                {
                    b.Property<int>("ProcedureCategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("procedure_category_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProcedureCategoryId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("description");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.HasKey("ProcedureCategoryId");

                    b.ToTable("procedure_category", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.ProcedureSubCategory", b =>
                {
                    b.Property<int>("ProcedureSubCategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("procedure_subcategory_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProcedureSubCategoryId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("description");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.Property<int>("ProcedureCategoryId")
                        .HasColumnType("int")
                        .HasColumnName("procedure_category_id");

                    b.HasKey("ProcedureSubCategoryId");

                    b.HasIndex("ProcedureCategoryId");

                    b.ToTable("procedure_subcategory", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.ProcedureType", b =>
                {
                    b.Property<int?>("ProcedureTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("procedure_type_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("ProcedureTypeId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("description");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.HasKey("ProcedureTypeId");

                    b.ToTable("procedure_type", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.Provider", b =>
                {
                    b.Property<int>("ProviderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("provider_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProviderId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("first_name");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("last_name");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<string>("Npi")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("npi");

                    b.HasKey("ProviderId");

                    b.ToTable("provider", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.TreatmentPlan", b =>
                {
                    b.Property<int>("TreatmentPlanId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("treatment_plan_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TreatmentPlanId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<int?>("CreatedUserId")
                        .HasColumnType("int")
                        .HasColumnName("created_user_id");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("description");

                    b.Property<int?>("FacilityProviderMapId")
                        .HasColumnType("int")
                        .HasColumnName("facility_provider_map_id");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<int?>("ProcedureSubcategoryId")
                        .HasColumnType("int")
                        .HasColumnName("procedure_subcategory_id");

                    b.Property<int?>("ToothNumber")
                        .HasColumnType("int")
                        .HasColumnName("tooth_number");

                    b.HasKey("TreatmentPlanId");

                    b.HasIndex("FacilityProviderMapId");

                    b.HasIndex("ProcedureSubcategoryId");

                    b.ToTable("treatment_plan", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.Visit", b =>
                {
                    b.Property<int>("VisitId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("visit_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VisitId"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<int?>("CreatedUserId")
                        .HasColumnType("int")
                        .HasColumnName("created_user_id");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("description");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<int>("TreatmentPlanId")
                        .HasColumnType("int")
                        .HasColumnName("treatment_plan_id");

                    b.Property<int>("VisitNumber")
                        .HasColumnType("int")
                        .HasColumnName("visit_number");

                    b.HasKey("VisitId");

                    b.HasIndex("TreatmentPlanId");

                    b.ToTable("visit", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.VisitCdtCodeMap", b =>
                {
                    b.Property<int>("VisitCdtCodeMapId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("visit_cdt_code_map_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VisitCdtCodeMapId"));

                    b.Property<int>("CdtCodeId")
                        .HasColumnType("int")
                        .HasColumnName("cdt_code_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("created_at");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime2")
                        .HasColumnName("modified_at");

                    b.Property<int>("Order")
                        .HasColumnType("int")
                        .HasColumnName("order");

                    b.Property<int?>("ProcedureTypeId")
                        .HasColumnType("int")
                        .HasColumnName("procedure_type_id");

                    b.Property<int>("VisitId")
                        .HasColumnType("int")
                        .HasColumnName("visit_id");

                    b.HasKey("VisitCdtCodeMapId");

                    b.HasIndex("CdtCodeId");

                    b.HasIndex("ProcedureTypeId");

                    b.HasIndex("VisitId");

                    b.ToTable("visit_cdt_code_map", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.VisitOrderRule", b =>
                {
                    b.Property<int>("VisitOrderRuleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("visit_order_rule_id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VisitOrderRuleId"));

                    b.Property<int>("OrderValue")
                        .HasColumnType("int")
                        .HasColumnName("order_value");

                    b.Property<int>("ToothNumberRangeEnd")
                        .HasColumnType("int")
                        .HasColumnName("tooth_number_range_end");

                    b.Property<int>("ToothNumberRangeStart")
                        .HasColumnType("int")
                        .HasColumnName("tooth_number_range_start");

                    b.Property<int>("VisitNumber")
                        .HasColumnType("int")
                        .HasColumnName("visit_number");

                    b.HasKey("VisitOrderRuleId");

                    b.ToTable("visit_order_rule", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.AlternativeProcedure", b =>
                {
                    b.HasOne("DentalTreatmentPlanner.Server.Models.CdtCode", "CdtCode")
                        .WithMany("AlternativeProcedures")
                        .HasForeignKey("CdtCodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CdtCode");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.CdtCode", b =>
                {
                    b.HasOne("DentalTreatmentPlanner.Server.Models.CdtCodeCategory", "CdtCodeCategory")
                        .WithMany()
                        .HasForeignKey("CdtCodeCategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DentalTreatmentPlanner.Server.Models.CdtCodeSubcategory", "CdtCodeSubcategory")
                        .WithMany("CdtCodes")
                        .HasForeignKey("CdtCodeSubcategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DentalTreatmentPlanner.Server.Models.Facility", "Facility")
                        .WithMany("CdtCodes")
                        .HasForeignKey("FacilityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CdtCodeCategory");

                    b.Navigation("CdtCodeSubcategory");

                    b.Navigation("Facility");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.FacilityProviderMap", b =>
                {
                    b.HasOne("DentalTreatmentPlanner.Server.Models.Facility", "Facility")
                        .WithMany("FacilityProviderMaps")
                        .HasForeignKey("FacilityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DentalTreatmentPlanner.Server.Models.Provider", "Provider")
                        .WithMany("FacilityProviderMaps")
                        .HasForeignKey("ProviderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Facility");

                    b.Navigation("Provider");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.ProcedureSubCategory", b =>
                {
                    b.HasOne("DentalTreatmentPlanner.Server.Models.ProcedureCategory", "ProcedureCategory")
                        .WithMany("ProcedureSubCategories")
                        .HasForeignKey("ProcedureCategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ProcedureCategory");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.TreatmentPlan", b =>
                {
                    b.HasOne("DentalTreatmentPlanner.Server.Models.FacilityProviderMap", "FacilityProviderMap")
                        .WithMany()
                        .HasForeignKey("FacilityProviderMapId");

                    b.HasOne("DentalTreatmentPlanner.Server.Models.ProcedureSubCategory", "ProcedureSubcategory")
                        .WithMany("TreatmentPlans")
                        .HasForeignKey("ProcedureSubcategoryId");

                    b.Navigation("FacilityProviderMap");

                    b.Navigation("ProcedureSubcategory");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.Visit", b =>
                {
                    b.HasOne("DentalTreatmentPlanner.Server.Models.TreatmentPlan", "TreatmentPlan")
                        .WithMany("Visits")
                        .HasForeignKey("TreatmentPlanId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TreatmentPlan");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.VisitCdtCodeMap", b =>
                {
                    b.HasOne("DentalTreatmentPlanner.Server.Models.CdtCode", "CdtCode")
                        .WithMany("VisitCdtCodeMaps")
                        .HasForeignKey("CdtCodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DentalTreatmentPlanner.Server.Models.ProcedureType", "ProcedureType")
                        .WithMany("VisitCdtCodeMaps")
                        .HasForeignKey("ProcedureTypeId");

                    b.HasOne("DentalTreatmentPlanner.Server.Models.Visit", "Visit")
                        .WithMany("VisitCdtCodeMaps")
                        .HasForeignKey("VisitId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CdtCode");

                    b.Navigation("ProcedureType");

                    b.Navigation("Visit");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.CdtCode", b =>
                {
                    b.Navigation("AlternativeProcedures");

                    b.Navigation("VisitCdtCodeMaps");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.CdtCodeSubcategory", b =>
                {
                    b.Navigation("CdtCodes");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.Facility", b =>
                {
                    b.Navigation("CdtCodes");

                    b.Navigation("FacilityProviderMaps");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.ProcedureCategory", b =>
                {
                    b.Navigation("ProcedureSubCategories");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.ProcedureSubCategory", b =>
                {
                    b.Navigation("TreatmentPlans");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.ProcedureType", b =>
                {
                    b.Navigation("VisitCdtCodeMaps");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.Provider", b =>
                {
                    b.Navigation("FacilityProviderMaps");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.TreatmentPlan", b =>
                {
                    b.Navigation("Visits");
                });

            modelBuilder.Entity("DentalTreatmentPlanner.Server.Models.Visit", b =>
                {
                    b.Navigation("VisitCdtCodeMaps");
                });
#pragma warning restore 612, 618
        }
    }
}
