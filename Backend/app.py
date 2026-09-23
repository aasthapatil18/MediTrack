from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
load_dotenv()
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)

# Allow frontend running on port 5500 to access Flask
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://127.0.0.1:5500",
            "http://localhost:5500"
        ]
    }
})


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_db_connection():

    connection = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE")
    )

    return connection

# =========================================================
# HOME
# =========================================================

@app.route("/", methods=["GET"])
def home():
    return "MediTrack Backend is running!"


# =========================================================
# TEST DATABASE
# =========================================================

@app.route("/test-db", methods=["GET"])
def test_db():

    connection = None

    try:
        connection = get_db_connection()

        if connection.is_connected():
            return "MySQL Database Connected Successfully!"

    except mysql.connector.Error as error:

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        if connection and connection.is_connected():
            connection.close()


# =========================================================
# GET ALL MEDICINES
# =========================================================

@app.route("/medicines", methods=["GET"])
def get_medicines():

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM medicines ORDER BY id DESC"
        )

        medicines = cursor.fetchall()

        for medicine in medicines:

            for key, value in medicine.items():

                if hasattr(value, "total_seconds"):

                    total_seconds = int(value.total_seconds())

                    hours = total_seconds // 3600
                    minutes = (total_seconds % 3600) // 60
                    seconds = total_seconds % 60

                    medicine[key] = (
                        f"{hours:02d}:"
                        f"{minutes:02d}:"
                        f"{seconds:02d}"
                    )

                elif hasattr(value, "isoformat"):

                    medicine[key] = value.isoformat()

        return jsonify(medicines)

    except mysql.connector.Error as error:

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()


# =========================================================
# ADD MEDICINE
# =========================================================

@app.route("/medicines", methods=["POST"])
def add_medicine():

    connection = None
    cursor = None

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No medicine data received"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO medicines (
                medicine_name,
                generic_name,
                manufacturer,
                strength,
                medicine_form,
                manufacture_date,
                expiry_date,
                quantity,
                batch_number,
                storage_condition,
                uses,
                precautions,
                side_effects,
                dosage,
                frequency,
                notes
            )
            VALUES (
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s
            )
        """

        values = (
            data.get("medicine_name"),
            data.get("generic_name"),
            data.get("manufacturer"),
            data.get("strength"),
            data.get("medicine_form"),
            data.get("manufacture_date"),
            data.get("expiry_date"),
            data.get("quantity", 0),
            data.get("batch_number"),
            data.get("storage_condition"),
            data.get("uses"),
            data.get("precautions"),
            data.get("side_effects"),
            data.get("dosage"),
            data.get("frequency"),
            data.get("notes")
        )

        cursor.execute(query, values)

        connection.commit()

        new_id = cursor.lastrowid

        return jsonify({
            "message": "Medicine added successfully",
            "id": new_id
        }), 201

    except mysql.connector.Error as error:

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()


# =========================================================
# UPDATE MEDICINE
# =========================================================

@app.route("/medicines/<int:medicine_id>", methods=["PUT"])
def update_medicine(medicine_id):

    connection = None
    cursor = None

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No medicine data received"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            UPDATE medicines
            SET
                medicine_name = %s,
                generic_name = %s,
                manufacturer = %s,
                strength = %s,
                medicine_form = %s,
                manufacture_date = %s,
                expiry_date = %s,
                quantity = %s,
                batch_number = %s,
                storage_condition = %s,
                uses = %s,
                precautions = %s,
                side_effects = %s,
                dosage = %s,
                frequency = %s,
                notes = %s
            WHERE id = %s
        """

        values = (
            data.get("medicine_name"),
            data.get("generic_name"),
            data.get("manufacturer"),
            data.get("strength"),
            data.get("medicine_form"),
            data.get("manufacture_date"),
            data.get("expiry_date"),
            data.get("quantity", 0),
            data.get("batch_number"),
            data.get("storage_condition"),
            data.get("uses"),
            data.get("precautions"),
            data.get("side_effects"),
            data.get("dosage"),
            data.get("frequency"),
            data.get("notes"),
            medicine_id
        )

        cursor.execute(query, values)

        connection.commit()

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Medicine not found"
            }), 404

        return jsonify({
            "message": "Medicine updated successfully"
        })

    except mysql.connector.Error as error:

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()


# =========================================================
# DELETE MEDICINE
# =========================================================

@app.route("/medicines/<int:medicine_id>", methods=["DELETE"])
def delete_medicine(medicine_id):

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM medicines WHERE id = %s",
            (medicine_id,)
        )

        connection.commit()

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Medicine not found"
            }), 404

        return jsonify({
            "message": "Medicine deleted successfully"
        })

    except mysql.connector.Error as error:

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()


# =========================================================
# GET ALL REMINDERS
# =========================================================

@app.route("/reminders", methods=["GET"])
def get_reminders():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                medicine_id,
                reminder_date,
                reminder_time,
                reminder_type,
                dosage,
                frequency,
                notes,
                status,
                taken_at,
                active
            FROM reminders
            ORDER BY reminder_date, reminder_time
        """)

        reminders = cursor.fetchall()

        for reminder in reminders:

            if reminder["reminder_date"]:
                reminder["reminder_date"] = reminder["reminder_date"].strftime("%Y-%m-%d")

            if reminder["reminder_time"]:
                if hasattr(reminder["reminder_time"], "total_seconds"):
                    total_seconds = int(
                        reminder["reminder_time"].total_seconds()
                    )

                    hours = total_seconds // 3600
                    minutes = (total_seconds % 3600) // 60
                    seconds = total_seconds % 60

                    reminder["reminder_time"] = (
                        f"{hours:02d}:{minutes:02d}:{seconds:02d}"
                    )
                else:
                    reminder["reminder_time"] = (
                        reminder["reminder_time"].strftime("%H:%M:%S")
                    )

            if reminder["taken_at"]:
                reminder["taken_at"] = reminder["taken_at"].strftime(
                    "%Y-%m-%d %H:%M:%S"
                )

            reminder["active"] = bool(reminder["active"])

        return jsonify(reminders)

    except mysql.connector.Error as error:
        print("GET REMINDERS ERROR:", error)
        return jsonify({"error": str(error)}), 500

    except Exception as error:
        print("GET REMINDERS ERROR:", error)
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()

# =========================================================
# ADD REMINDER
# =========================================================

@app.route("/reminders", methods=["POST"])
def add_reminder():

    connection = None
    cursor = None

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No reminder data received"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO reminders
            (
                medicine_id,
                reminder_date,
                reminder_time,
                reminder_type,
                dosage,
                frequency,
                notes,
                status,
                active
            )
            VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s
            )
        """, (
            data.get("medicine_id"),
            data.get("reminder_date"),
            data.get("reminder_time"),
            data.get("reminder_type", "Medicine"),
            data.get("dosage"),
            data.get("frequency", "Daily"),
            data.get("notes"),
            data.get("status", "pending"),
            data.get("active", True)
        ))

        connection.commit()

        reminder_id = cursor.lastrowid

        return jsonify({
            "message": "Reminder added successfully",
            "id": reminder_id
        }), 201

    except mysql.connector.Error as error:

        print("ADD REMINDER ERROR:", error)

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:

        print("ADD REMINDER ERROR:", error)

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()


# =========================================================
# UPDATE REMINDER
# =========================================================

@app.route("/reminders/<int:reminder_id>", methods=["PUT"])
def update_reminder(reminder_id):

    connection = None
    cursor = None

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No reminder data received"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE reminders
            SET
                medicine_id = %s,
                reminder_date = %s,
                reminder_time = %s,
                reminder_type = %s,
                dosage = %s,
                frequency = %s,
                notes = %s,
                status = %s,
                taken_at = %s,
                active = %s
            WHERE id = %s
        """, (
            data.get("medicine_id"),
            data.get("reminder_date"),
            data.get("reminder_time"),
            data.get("reminder_type", "Medicine"),
            data.get("dosage"),
            data.get("frequency", "Daily"),
            data.get("notes"),
            data.get("status", "pending"),
            data.get("taken_at"),
            data.get("active", True),
            reminder_id
        ))

        connection.commit()

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Reminder not found"
            }), 404

        return jsonify({
            "message": "Reminder updated successfully"
        })

    except mysql.connector.Error as error:

        print("UPDATE REMINDER ERROR:", error)

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:

        print("UPDATE REMINDER ERROR:", error)

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()


# =========================================================
# DELETE REMINDER
# =========================================================

@app.route("/reminders/<int:reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):

    connection = None
    cursor = None

    try:

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM reminders WHERE id = %s",
            (reminder_id,)
        )

        connection.commit()

        if cursor.rowcount == 0:

            return jsonify({
                "error": "Reminder not found"
            }), 404

        return jsonify({
            "message": "Reminder deleted successfully"
        })

    except mysql.connector.Error as error:

        print("DELETE REMINDER ERROR:", error)

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:

        print("DELETE REMINDER ERROR:", error)

        return jsonify({
            "error": str(error)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()


# =========================================================
# RUN FLASK SERVER
# =========================================================

if __name__ == "__main__":
    app.run(debug=True)