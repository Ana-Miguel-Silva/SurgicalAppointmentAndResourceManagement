﻿// <auto-generated />
using System;
using DDDSample1.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DDDNetCore.Migrations
{
    [DbContext(typeof(DDDSample1DbContext))]
    partial class DDDSample1DbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("DDDSample1.Domain.Categories.Category", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("DDDSample1.Domain.Families.Family", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Families");
                });

            modelBuilder.Entity("DDDSample1.Domain.OperationRequests.OperationRequest", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTime>("Deadline")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("DoctorId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("MedicalRecordNumber")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("OperationTypeId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Priority")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("OperationRequests");
                });

            modelBuilder.Entity("DDDSample1.Domain.OperationTypes.OperationType", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("OperationTypes");
                });

            modelBuilder.Entity("DDDSample1.Domain.Patients.Patient", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Allergies")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("AppointmentHistory")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("gender")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Patients");
                });

            modelBuilder.Entity("DDDSample1.Domain.Products.Product", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("CategoryId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("DDDSample1.Domain.Staff.StaffProfile", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("LicenseNumber")
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Specialization")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("StaffId")
                        .IsRequired()
                        .HasColumnType("varchar(255)")
                        .HasColumnName("StaffInteralID");

                    b.HasKey("Id");

                    b.HasIndex("LicenseNumber")
                        .IsUnique();

                    b.HasIndex("StaffId")
                        .IsUnique();

                    b.ToTable("StaffProfiles");
                });

            modelBuilder.Entity("DDDSample1.Domain.Users.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("DDDSample1.Domain.OperationTypes.OperationType", b =>
                {
                    b.OwnsOne("DDDSample1.Domain.Shared.EstimatedDuration", "EstimatedDuration", b1 =>
                        {
                            b1.Property<string>("OperationTypeId")
                                .HasColumnType("varchar(255)");

                            b1.Property<TimeOnly>("Cleaning")
                                .HasColumnType("time(6)")
                                .HasColumnName("CleaningDuration");

                            b1.Property<TimeOnly>("PatientPreparation")
                                .HasColumnType("time(6)")
                                .HasColumnName("PatientPreparationDuration");

                            b1.Property<TimeOnly>("Surgery")
                                .HasColumnType("time(6)")
                                .HasColumnName("SurgeryDuration");

                            b1.HasKey("OperationTypeId");

                            b1.ToTable("OperationTypes");

                            b1.WithOwner()
                                .HasForeignKey("OperationTypeId");
                        });

                    b.OwnsMany("DDDSample1.Domain.Shared.RequiredStaff", "RequiredStaff", b1 =>
                        {
                            b1.Property<string>("OperationTypeId")
                                .HasColumnType("varchar(255)");

                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("int");

                            MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b1.Property<int>("Id"));

                            b1.Property<int>("Quantity")
                                .HasColumnType("int")
                                .HasColumnName("Quantity");

                            b1.Property<string>("Role")
                                .IsRequired()
                                .HasColumnType("longtext")
                                .HasColumnName("Role");

                            b1.Property<string>("Specialization")
                                .IsRequired()
                                .HasColumnType("longtext")
                                .HasColumnName("Specialization");

                            b1.HasKey("OperationTypeId", "Id");

                            b1.ToTable("OperationTypeRequiredStaff", (string)null);

                            b1.WithOwner()
                                .HasForeignKey("OperationTypeId");
                        });

                    b.Navigation("EstimatedDuration")
                        .IsRequired();

                    b.Navigation("RequiredStaff");
                });

            modelBuilder.Entity("DDDSample1.Domain.Patients.Patient", b =>
                {
                    b.OwnsOne("DDDSample1.Domain.Patients.EmergencyContact", "EmergencyContact", b1 =>
                        {
                            b1.Property<string>("PatientId")
                                .HasColumnType("varchar(255)");

                            b1.HasKey("PatientId");

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");

                            b1.OwnsOne("DDDSample1.Domain.Shared.Email", "Email", b2 =>
                                {
                                    b2.Property<string>("EmergencyContactPatientId")
                                        .HasColumnType("varchar(255)");

                                    b2.Property<string>("FullEmail")
                                        .IsRequired()
                                        .HasColumnType("longtext")
                                        .HasColumnName("EmergencyContactEmail");

                                    b2.HasKey("EmergencyContactPatientId");

                                    b2.ToTable("Patients");

                                    b2.WithOwner()
                                        .HasForeignKey("EmergencyContactPatientId");
                                });

                            b1.OwnsOne("DDDSample1.Domain.Shared.FullName", "Name", b2 =>
                                {
                                    b2.Property<string>("EmergencyContactPatientId")
                                        .HasColumnType("varchar(255)");

                                    b2.Property<string>("FirstName")
                                        .IsRequired()
                                        .HasColumnType("longtext")
                                        .HasColumnName("EmergencyContactFirstName");

                                    b2.Property<string>("LastName")
                                        .IsRequired()
                                        .HasColumnType("longtext")
                                        .HasColumnName("EmergencyContactLastName");

                                    b2.Property<string>("MiddleNames")
                                        .IsRequired()
                                        .HasColumnType("longtext");

                                    b2.HasKey("EmergencyContactPatientId");

                                    b2.ToTable("Patients");

                                    b2.WithOwner()
                                        .HasForeignKey("EmergencyContactPatientId");
                                });

                            b1.OwnsOne("DDDSample1.Domain.Shared.PhoneNumber", "Phone", b2 =>
                                {
                                    b2.Property<string>("EmergencyContactPatientId")
                                        .HasColumnType("varchar(255)");

                                    b2.Property<string>("Number")
                                        .IsRequired()
                                        .HasMaxLength(15)
                                        .HasColumnType("varchar(15)")
                                        .HasColumnName("EmergencyContactPhone");

                                    b2.HasKey("EmergencyContactPatientId");

                                    b2.ToTable("Patients");

                                    b2.WithOwner()
                                        .HasForeignKey("EmergencyContactPatientId");
                                });

                            b1.Navigation("Email")
                                .IsRequired();

                            b1.Navigation("Name")
                                .IsRequired();

                            b1.Navigation("Phone")
                                .IsRequired();
                        });

                    b.OwnsOne("DDDSample1.Domain.Shared.Email", "Email", b1 =>
                        {
                            b1.Property<string>("PatientId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("FullEmail")
                                .IsRequired()
                                .HasColumnType("varchar(255)")
                                .HasColumnName("Email");

                            b1.HasKey("PatientId");

                            b1.HasIndex("FullEmail")
                                .IsUnique();

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");
                        });

                    b.OwnsOne("DDDSample1.Domain.Shared.PhoneNumber", "Phone", b1 =>
                        {
                            b1.Property<string>("PatientId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("Number")
                                .IsRequired()
                                .HasMaxLength(15)
                                .HasColumnType("varchar(15)")
                                .HasColumnName("PhoneNumber");

                            b1.HasKey("PatientId");

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");
                        });

                    b.OwnsOne("DDDSample1.Domain.Shared.Email", "UserEmail", b1 =>
                        {
                            b1.Property<string>("PatientId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("FullEmail")
                                .IsRequired()
                                .HasColumnType("varchar(255)")
                                .HasColumnName("UserEmail");

                            b1.HasKey("PatientId");

                            b1.HasIndex("FullEmail")
                                .IsUnique();

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");
                        });

                    b.OwnsOne("DDDSample1.Domain.Shared.FullName", "name", b1 =>
                        {
                            b1.Property<string>("PatientId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("FirstName")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("varchar(100)")
                                .HasColumnName("FirstName");

                            b1.Property<string>("LastName")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("varchar(100)")
                                .HasColumnName("LastName");

                            b1.Property<string>("MiddleNames")
                                .IsRequired()
                                .HasMaxLength(200)
                                .HasColumnType("varchar(200)")
                                .HasColumnName("MiddleNames");

                            b1.HasKey("PatientId");

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");
                        });

                    b.OwnsOne("DDDSample1.Domain.Shared.MedicalRecordNumber", "medicalRecordNumber", b1 =>
                        {
                            b1.Property<string>("PatientId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("number")
                                .IsRequired()
                                .HasColumnType("longtext")
                                .HasColumnName("MedicalRecordNumber");

                            b1.HasKey("PatientId");

                            b1.ToTable("Patients");

                            b1.WithOwner()
                                .HasForeignKey("PatientId");
                        });

                    b.Navigation("Email")
                        .IsRequired();

                    b.Navigation("EmergencyContact")
                        .IsRequired();

                    b.Navigation("Phone")
                        .IsRequired();

                    b.Navigation("UserEmail")
                        .IsRequired();

                    b.Navigation("medicalRecordNumber")
                        .IsRequired();

                    b.Navigation("name")
                        .IsRequired();
                });

            modelBuilder.Entity("DDDSample1.Domain.Staff.StaffProfile", b =>
                {
                    b.OwnsMany("DDDSample1.Domain.Shared.Slot", "AvailabilitySlots", b1 =>
                        {
                            b1.Property<string>("StaffProfileId")
                                .HasColumnType("varchar(255)");

                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("int");

                            MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b1.Property<int>("Id"));

                            b1.Property<DateTime>("EndTime")
                                .HasColumnType("datetime(6)")
                                .HasColumnName("EndTime");

                            b1.Property<DateTime>("StartTime")
                                .HasColumnType("datetime(6)")
                                .HasColumnName("StartTime");

                            b1.HasKey("StaffProfileId", "Id");

                            b1.ToTable("StaffAvailabilitySlots", (string)null);

                            b1.WithOwner()
                                .HasForeignKey("StaffProfileId");
                        });

                    b.OwnsOne("DDDSample1.Domain.Shared.Email", "Email", b1 =>
                        {
                            b1.Property<string>("StaffProfileId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("FullEmail")
                                .IsRequired()
                                .HasColumnType("varchar(255)")
                                .HasColumnName("Email");

                            b1.HasKey("StaffProfileId");

                            b1.HasIndex("FullEmail")
                                .IsUnique();

                            b1.ToTable("StaffProfiles");

                            b1.WithOwner()
                                .HasForeignKey("StaffProfileId");
                        });

                    b.OwnsOne("DDDSample1.Domain.Shared.FullName", "Name", b1 =>
                        {
                            b1.Property<string>("StaffProfileId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("FirstName")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("varchar(100)")
                                .HasColumnName("FirstName");

                            b1.Property<string>("LastName")
                                .IsRequired()
                                .HasMaxLength(100)
                                .HasColumnType("varchar(100)")
                                .HasColumnName("LastName");

                            b1.Property<string>("MiddleNames")
                                .IsRequired()
                                .HasMaxLength(200)
                                .HasColumnType("varchar(200)")
                                .HasColumnName("MiddleNames");

                            b1.HasKey("StaffProfileId");

                            b1.ToTable("StaffProfiles");

                            b1.WithOwner()
                                .HasForeignKey("StaffProfileId");
                        });

                    b.OwnsOne("DDDSample1.Domain.Shared.PhoneNumber", "PhoneNumber", b1 =>
                        {
                            b1.Property<string>("StaffProfileId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("Number")
                                .IsRequired()
                                .HasMaxLength(9)
                                .HasColumnType("varchar(9)")
                                .HasColumnName("PhoneNumber");

                            b1.HasKey("StaffProfileId");

                            b1.HasIndex("Number")
                                .IsUnique();

                            b1.ToTable("StaffProfiles");

                            b1.WithOwner()
                                .HasForeignKey("StaffProfileId");
                        });

                    b.Navigation("AvailabilitySlots");

                    b.Navigation("Email")
                        .IsRequired();

                    b.Navigation("Name")
                        .IsRequired();

                    b.Navigation("PhoneNumber")
                        .IsRequired();
                });

            modelBuilder.Entity("DDDSample1.Domain.Users.User", b =>
                {
                    b.OwnsOne("DDDSample1.Domain.Shared.Password", "Password", b1 =>
                        {
                            b1.Property<string>("UserId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("Pass")
                                .IsRequired()
                                .HasColumnType("longtext")
                                .HasColumnName("Password");

                            b1.HasKey("UserId");

                            b1.ToTable("Users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.OwnsOne("DDDSample1.Domain.Shared.Email", "Email", b1 =>
                        {
                            b1.Property<string>("UserId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("FullEmail")
                                .IsRequired()
                                .HasColumnType("varchar(255)")
                                .HasColumnName("Email");

                            b1.HasKey("UserId");

                            b1.HasIndex("FullEmail")
                                .IsUnique();

                            b1.ToTable("Users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.Navigation("Email")
                        .IsRequired();

                    b.Navigation("Password")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
