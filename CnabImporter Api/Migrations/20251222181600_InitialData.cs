using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder mb)
        {
			mb.Sql(@"INSERT INTO users (
                id,
                is_active,
                created_at,
                first_name,
                last_name,
                email,
                cpf,
                sign_in_with,
                type,
                birth_date,
                password_hash,
                activation_code,
                activation_at,
                reset_password,
                accepted_terms_at
            ) VALUES (
                1,
                true,
                now(),
                'Admin',
                'System',
                'admin@gmail.com',
                '12345678910',
                'Google',
                'Admin',
                now(),
                '$2a$11$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                null,
                now(),
                false,
                now()
            );");

			mb.Sql(
                @"INSERT INTO transaction_types (id, description, nature, signal) VALUES
                  (1, 'Debit', 'Income', '+'),
			      (2, 'Boleto', 'Expense', '-'),
			      (3, 'Financing', 'Expense', '-'),
			      (4, 'Credit', 'Income', '+'),
			      (5, 'Loan Receipt', 'Income', '+'),
			      (6, 'Sales', 'Income', '+'),
			      (7, 'TED Receipt', 'Income', '+'),
			      (8, 'DOC Receipt', 'Income', '+'),
			      (9, 'Rent', 'Expense', '-');");

		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder mb)
        {

        }
    }
}
