﻿// <auto-generated />
using System;
using DDDSample1.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DDDNetCore.Migrations
{
    [DbContext(typeof(DDDSample1DbContext))]
    [Migration("20241017212659_AddPriorityToOperationRequest")]
    partial class AddPriorityToOperationRequest
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("DDDSample1.Domain.Appointments.Appointment", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("AppStatus")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("OperationRequestId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("RoomId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Appointments");
                });

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

                    b.Property<string>("OperationTypeId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("PatientId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Priority")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("Priority");

                    b.HasKey("Id");

                    b.ToTable("OperationRequests");
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

            modelBuilder.Entity("DDDSample1.Domain.SurgeryRooms.SurgeryRoom", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("AssignedEquipment")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Capacity")
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("SurgeryRooms");
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

            modelBuilder.Entity("DDDSample1.Domain.SurgeryRooms.SurgeryRoom", b =>
                {
                    b.OwnsMany("DDDSample1.Domain.Shared.Slot", "MaintenanceSlots", b1 =>
                        {
                            b1.Property<string>("SurgeryRoomId")
                                .HasColumnType("varchar(255)");

                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("int");

                            MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b1.Property<int>("Id"));

                            b1.Property<DateOnly>("EndDate")
                                .HasColumnType("date")
                                .HasColumnName("EndDate");

                            b1.Property<TimeSpan>("EndTime")
                                .HasColumnType("time(6)")
                                .HasColumnName("EndTime");

                            b1.Property<DateOnly>("StartDate")
                                .HasColumnType("date")
                                .HasColumnName("StartDate");

                            b1.Property<TimeSpan>("StartTime")
                                .HasColumnType("time(6)")
                                .HasColumnName("StartTime");

                            b1.HasKey("SurgeryRoomId", "Id");

                            b1.ToTable("SurgeryRoomMaintenanceSlots", (string)null);

                            b1.WithOwner()
                                .HasForeignKey("SurgeryRoomId");
                        });

                    b.Navigation("MaintenanceSlots");
                });

            modelBuilder.Entity("DDDSample1.Domain.Users.User", b =>
                {
                    b.OwnsOne("DDDSample1.Domain.Shared.Email", "Email", b1 =>
                        {
                            b1.Property<string>("UserId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("FullEmail")
                                .IsRequired()
                                .HasColumnType("longtext")
                                .HasColumnName("Email");

                            b1.HasKey("UserId");

                            b1.ToTable("Users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.Navigation("Email")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
