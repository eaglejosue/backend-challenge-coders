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
                CURRENT_TIMESTAMP,
                'Admin',
                'System',
                'admin@gmail.com',
                '12345678910',
                'Google',
                'Admin',
                CURRENT_TIMESTAMP,
                '$2a$11$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                null,
                CURRENT_TIMESTAMP,
                false,
                CURRENT_TIMESTAMP
            );");

			mb.Sql(
				@"INSERT INTO transaction_types (id, is_active, created_at, type, description, nature, sign) VALUES
                  (1, true, CURRENT_TIMESTAMP, 1, 'Debit', 'Income', '+'),
			      (2, true, CURRENT_TIMESTAMP, 2, 'Boleto', 'Expense', '-'),
			      (3, true, CURRENT_TIMESTAMP, 3, 'Financing', 'Expense', '-'),
			      (4, true, CURRENT_TIMESTAMP, 4, 'Credit', 'Income', '+'),
			      (5, true, CURRENT_TIMESTAMP, 5, 'Loan Receipt', 'Income', '+'),
			      (6, true, CURRENT_TIMESTAMP, 6, 'Sales', 'Income', '+'),
			      (7, true, CURRENT_TIMESTAMP, 7, 'TED Receipt', 'Income', '+'),
			      (8, true, CURRENT_TIMESTAMP, 8, 'DOC Receipt', 'Income', '+'),
			      (9, true, CURRENT_TIMESTAMP, 9, 'Rent', 'Expense', '-');");

		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder mb)
        {

        }
    }
}
